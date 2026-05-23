#!/usr/bin/env node
/**
 * Banner Gen — MCP Server (stdio transport)
 *
 * Implements the Model Context Protocol over stdin/stdout (JSON-RPC 2.0).
 * Compatible with Claude Code, Claude Desktop, and any MCP-aware agent.
 *
 * Usage (add to your agent's MCP config):
 *   {
 *     "banner-gen": {
 *       "command": "node",
 *       "args": ["/path/to/mcp-server.js"],
 *       "env": {
 *         "BANNER_GEN_URL": "https://azbet-image-generator-production.up.railway.app",
 *         "BANNER_GEN_API_KEY": "<your-api-key>"
 *       }
 *     }
 *   }
 *
 * Or for local dev (no env needed, auth disabled):
 *   BANNER_GEN_URL=http://localhost:3000 node mcp-server.js
 */

'use strict';

const readline = require('readline');

const BASE_URL    = (process.env.BANNER_GEN_URL || 'http://localhost:3000').replace(/\/$/, '');
const API_KEY     = process.env.BANNER_GEN_API_KEY || process.env.API_KEY || '';
const SERVER_NAME = 'banner-gen';
const SERVER_VER  = '1.0.0';
const PROTO_VER   = '2024-11-05';

// ── HTTP helper ───────────────────────────────────────────────────────────────
async function apiFetch(path, method = 'GET', body) {
  // node-fetch is already a project dependency
  const { default: fetch } = await import('node-fetch');
  const headers = { 'Content-Type': 'application/json' };
  if (API_KEY) headers['X-Api-Key'] = API_KEY;

  const res  = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// ── Tool definitions ──────────────────────────────────────────────────────────
const TOOLS = [
  {
    name: 'generate_banner',
    description:
      'Generate a marketing banner image for AzimutBet. ' +
      'The service uses AI to create the background image and overlays promotional text. ' +
      'Returns a Cloudinary URL ready to use in campaigns. ' +
      'Generation takes 20–40 seconds. ' +
      'Use variants to generate several promo texts on the same image in one call.',
    inputSchema: {
      type: 'object',
      required: ['vertical', 'country', 'subject', 'line2'],
      properties: {
        vertical: {
          type: 'string',
          enum: ['casino', 'sport'],
          description: 'Campaign vertical',
        },
        country: {
          type: 'string',
          enum: ['egypt', 'morocco', 'algeria', 'libya'],
          description: 'Target country (drives visual style and Arabic/Latin text direction)',
        },
        subject: {
          type: 'string',
          enum: ['woman', 'man', 'object'],
          description: 'Main subject of the scene',
        },
        line2: {
          type: 'string',
          description: 'Main promo text displayed on the badge (required). E.g. "100% + 30 TOURS"',
        },
        line1: {
          type: 'string',
          description: 'Optional top text line (no background). E.g. "WELCOME BONUS"',
        },
        line3: {
          type: 'string',
          description: 'Optional extra pill line below the badge. E.g. "78K + 150FS"',
        },
        accent_color: {
          type: 'string',
          enum: ['cyan', 'green', 'purple', 'gold'],
          default: 'cyan',
          description: 'Badge and overlay accent color',
        },
        plashka_style: {
          type: 'string',
          enum: ['filled', 'bordered'],
          default: 'filled',
          description: 'Badge background style: filled (solid color) or bordered (outline)',
        },
        image_size: {
          type: 'string',
          enum: ['portrait', 'square'],
          default: 'portrait',
          description: 'Image dimensions: portrait = 1024×1536 (mobile), square = 1024×1024',
        },
        sport_type: {
          type: 'string',
          enum: ['football', 'tennis', 'basketball', 'general'],
          description: 'Required when vertical=sport and subject≠object',
        },
        scene_prompt: {
          type: 'string',
          description: 'Optional free-text description of the scene to generate',
        },
        font_family: {
          type: 'string',
          description:
            'Font for overlay text. Options: Oswald (default), Bebas Neue, Anton, ' +
            'Barlow Condensed, Teko, Montserrat, Raleway, Roboto, Poppins, Inter, Exo 2, Orbitron',
        },
        extra_promos: {
          type: 'array',
          description:
            'Generate multiple promo variants from the same AI image. ' +
            'Each item adds a separate banner with different text. ' +
            'Cost: 1 AI generation regardless of the number of variants.',
          items: {
            type: 'object',
            required: ['line2'],
            properties: {
              line1: { type: 'string' },
              line2: { type: 'string' },
              line3: { type: 'string' },
            },
          },
        },
      },
    },
  },
  {
    name: 'list_banners',
    description: 'List recently generated banners with their URLs and metadata.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          default: 20,
          description: 'Maximum number of results to return (1–100)',
        },
      },
    },
  },
  {
    name: 'confirm_banner',
    description:
      'Mark a generated banner as confirmed/approved. ' +
      'Useful for tracking which banners have been reviewed and accepted.',
    inputSchema: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'number', description: 'Generation ID returned by generate_banner' },
      },
    },
  },
  {
    name: 'regenerate_banner',
    description:
      'Regenerate the AI background image for an existing banner, keeping the same text overlay. ' +
      'Use when you want a different visual for the same promo.',
    inputSchema: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'number', description: 'Generation ID to regenerate' },
      },
    },
  },
];

// ── Tool implementations ──────────────────────────────────────────────────────
async function callTool(name, args) {
  switch (name) {
    case 'generate_banner': {
      const variants = [
        {
          line1: args.line1 || null,
          line2: args.line2,
          line3: args.line3 || null,
        },
        ...(args.extra_promos || []).map(p => ({
          line1: p.line1 || null,
          line2: p.line2,
          line3: p.line3 || null,
        })),
      ];

      const data = await apiFetch('/api/generate', 'POST', {
        vertical:     args.vertical,
        country:      args.country,
        subject:      args.subject,
        accentColor:  args.accent_color  || 'cyan',
        plashkaStyle: args.plashka_style || 'filled',
        imageSize:    args.image_size    || 'portrait',
        sportType:    args.sport_type    || null,
        scenePrompt:  args.scene_prompt  || null,
        fontFamily:   args.font_family   || 'Oswald',
        variants,
      });

      const gens = data.generations || [];
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            count: gens.length,
            banners: gens.map(g => ({
              id:    g.id,
              url:   g.final_url,
              line2: g.line2 || g.banner_text,
            })),
          }, null, 2),
        }],
      };
    }

    case 'list_banners': {
      const limit = Math.min(100, Math.max(1, parseInt(args.limit) || 20));
      const data  = await apiFetch(`/api/generations?limit=${limit}`);
      const rows  = (data.generations || []).map(g => ({
        id:         g.id,
        url:        g.final_url,
        line2:      g.line2 || g.banner_text,
        vertical:   g.vertical,
        country:    g.country,
        status:     g.status,
        created_at: g.created_at,
      }));
      return {
        content: [{ type: 'text', text: JSON.stringify({ count: rows.length, banners: rows }, null, 2) }],
      };
    }

    case 'confirm_banner': {
      const data = await apiFetch(`/api/generate/${args.id}/confirm`, 'POST');
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: true, id: data.generation.id, status: data.generation.status }),
        }],
      };
    }

    case 'regenerate_banner': {
      const data = await apiFetch(`/api/generate/${args.id}/regenerate`, 'POST');
      const g    = data.generation;
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: true, id: g.id, url: g.final_url, line2: g.line2 || g.banner_text }),
        }],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ── MCP JSON-RPC dispatcher ───────────────────────────────────────────────────
async function handleMessage(msg) {
  const { id, method, params } = msg;

  try {
    let result;

    switch (method) {
      case 'initialize':
        result = {
          protocolVersion: PROTO_VER,
          serverInfo: { name: SERVER_NAME, version: SERVER_VER },
          capabilities: { tools: {} },
        };
        break;

      case 'notifications/initialized':
        // Notification — no response needed
        return null;

      case 'ping':
        result = {};
        break;

      case 'tools/list':
        result = { tools: TOOLS };
        break;

      case 'tools/call': {
        const toolName = params?.name;
        const toolArgs = params?.arguments || {};
        result = await callTool(toolName, toolArgs);
        break;
      }

      default:
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Method not found: ${method}` },
        };
    }

    return result !== null ? { jsonrpc: '2.0', id, result } : null;
  } catch (err) {
    return {
      jsonrpc: '2.0',
      id,
      error: { code: -32000, message: err.message },
    };
  }
}

// ── stdio transport ───────────────────────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, terminal: false });

rl.on('line', async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  let msg;
  try {
    msg = JSON.parse(trimmed);
  } catch {
    const errResp = {
      jsonrpc: '2.0',
      id: null,
      error: { code: -32700, message: 'Parse error' },
    };
    process.stdout.write(JSON.stringify(errResp) + '\n');
    return;
  }

  const response = await handleMessage(msg);
  if (response) {
    process.stdout.write(JSON.stringify(response) + '\n');
  }
});

rl.on('close', () => process.exit(0));

process.stderr.write(
  `[banner-gen MCP] Ready — connecting to ${BASE_URL} (auth: ${API_KEY ? 'yes' : 'no'})\n`
);
