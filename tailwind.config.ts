import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Neovim-specific colors
				'nvim-bg': 'hsl(var(--nvim-bg))',
				'nvim-bg-alt': 'hsl(var(--nvim-bg-alt))',
				'nvim-bg-highlight': 'hsl(var(--nvim-bg-highlight))',
				'nvim-bg-visual': 'hsl(var(--nvim-bg-visual))',
				'nvim-fg': 'hsl(var(--nvim-fg))',
				'nvim-fg-alt': 'hsl(var(--nvim-fg-alt))',
				'nvim-comment': 'hsl(var(--nvim-comment))',
				'nvim-linenr': 'hsl(var(--nvim-linenr))',
				'nvim-orange': 'hsl(var(--nvim-orange))',
				'nvim-orange-bright': 'hsl(var(--nvim-orange-bright))',
				'nvim-green': 'hsl(var(--nvim-green))',
				'nvim-green-bright': 'hsl(var(--nvim-green-bright))',
				'nvim-blue': 'hsl(var(--nvim-blue))',
				'nvim-blue-bright': 'hsl(var(--nvim-blue-bright))',
				'nvim-purple': 'hsl(var(--nvim-purple))',
				'nvim-red': 'hsl(var(--nvim-red))',
				'nvim-yellow': 'hsl(var(--nvim-yellow))',
				'nvim-cyan': 'hsl(var(--nvim-cyan))',
				'nvim-border': 'hsl(var(--nvim-border))',
				'nvim-cursor': 'hsl(var(--nvim-cursor))',
				'nvim-cursor-line': 'hsl(var(--nvim-cursor-line))',
				'nvim-selection': 'hsl(var(--nvim-selection))',
				'nvim-search': 'hsl(var(--nvim-search))',
				'nvim-statusline': 'hsl(var(--nvim-statusline))',
				'nvim-statusline-fg': 'hsl(var(--nvim-statusline-fg))',
				'nvim-mode-normal': 'hsl(var(--nvim-mode-normal))',
				'nvim-mode-insert': 'hsl(var(--nvim-mode-insert))',
				'nvim-mode-visual': 'hsl(var(--nvim-mode-visual))',
				'nvim-tree-bg': 'hsl(var(--nvim-tree-bg))',
				'nvim-tree-folder': 'hsl(var(--nvim-tree-folder))',
				'nvim-tree-file': 'hsl(var(--nvim-tree-file))',
				'nvim-tree-active': 'hsl(var(--nvim-tree-active))',
				'nvim-tree-hover': 'hsl(var(--nvim-tree-hover))',
			},
			fontFamily: {
				mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [await import("tailwindcss-animate").then(m => m.default)],
} satisfies Config;
