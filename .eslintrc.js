module.exports = {
	"env" : {
		"node"    : true,
		"browser" : true,
		"es2021"  : true
	},
	"extends" : [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended"
	],
	"parser"        : "@typescript-eslint/parser",
	"parserOptions" : {
		"ecmaFeatures" : {
			"jsx" : true
		},
		"ecmaVersion" : 12,
		"sourceType"  : "module"
	},
	"plugins" : [
		"align-import",
		"align-assignments",
		"@typescript-eslint"
	],
	"settings" : {
	},
	"rules" : {
		"indent" : [
			"error",
			"tab",
			{
				"SwitchCase" : 1
			}
		],
		// "@typescript-eslint/indent" : [ "error", 4 ],
		"@typescript-eslint/member-delimiter-style" : [
			"error",
			{
				"multiline" : {
					"delimiter"   : "none",
					"requireLast" : false
				},
				"singleline" : {
					"delimiter"   : "comma",
					"requireLast" : false
				}
			}
		],
		"@typescript-eslint/type-annotation-spacing" : [
			"error",
			{
				"before"    : false,
				"after"     : true,
				"overrides" : {
					"arrow" : {
						"before" : true,
						"after"  : true
					}
				}
			}
		],
		"linebreak-style" : [
			"error",
			"unix"
		],
		"quotes" : [
			"error",
			"double"
		],
		"semi" : [
			"error",
			"always"
		],
		"key-spacing" : [
			"error",
			{
				"singleLine" : {
					"beforeColon" : true,
					"afterColon"  : true
				},
				"multiLine" : {
					"beforeColon" : true,
					"afterColon"  : true
				},
				"align" : {
					"beforeColon" : true,
					"afterColon"  : true,
					"on"          : "colon"
				}
			}
		],
		"padding-line-between-statements" : [
			"error",
			{
				blankLine : "always",
				prev      : "*",
				next      : "return"
			},
			{
				blankLine : "always",
				prev      : [
					"case",
					"default"
				],
				next : "*"
			},
			{
				blankLine : "always",
				prev      : "directive",
				next      : "*"
			},
			{
				blankLine : "any",
				prev      : "directive",
				next      : "directive"
			},
			{
				blankLine : "always",
				prev      : [
					"const",
					"let",
					"var"
				],
				next : "*"
			},
			{
				blankLine : "any",
				prev      : [
					"const",
					"let",
					"var"
				],
				next : [
					"const",
					"let",
					"var"
				]
			}
		],
		"no-useless-escape" : [
			1
		],
		"@typescript-eslint/no-empty-interface" : "warn",
		"no-multiple-empty-lines"               : [
			"error",
			{
				"max" : 1
			}
		],
		"spaced-comment" : [
			"error",
			"always"
		],
		"arrow-parens" : [
			"error",
			"as-needed"
		],
		"max-len" : [
			"off",
			{
				code : 160
			}
		],
		/* "no-console" : [
			2
		], */
		"block-spacing" : "error",
		"brace-style"   : [
			"error",
			"1tbs",
			{
				"allowSingleLine" : false
			}
		],
		"comma-dangle" : [
			"error",
			"never"
		],
		"comma-spacing" : [
			"error",
			{
				"before" : false,
				"after"  : true
			}
		],
		"semi-spacing" : [
			"error",
			{
				"before" : false,
				"after"  : true
			}
		],
		"semi-style" : [
			"error",
			"last"
		],
		"space-before-blocks"         : "error",
		"space-before-function-paren" : [
			"error",
			"always"
		],
		"space-in-parens" : [
			"error",
			"always"
		],
		"func-call-spacing" : [
			"error",
			"always"
		],
		"switch-colon-spacing" : [
			"error",
			{
				"before" : false,
				"after"  : true
			}
		],
		"align-import/align-import" : [
			2
		],
		"align-import/trim-import" : [
			2
		],
		"align-assignments/align-assignments" : [
			2,
			{
				"requiresOnly" : false
			}
		],
		"template-curly-spacing" : [
			"error",
			"always"
		],
		"no-trailing-spaces" : [
			2
		],
		"no-whitespace-before-property" : "error",
		"no-multi-spaces"               : [
			"error",
			{
				"exceptions" : {
					"ImportDeclaration"    : true,
					"VariableDeclarator"   : true,
					"AssignmentExpression" : true,
					"JSXAttribute"         : true
				}
			}
		],
		"no-mixed-spaces-and-tabs" : [
			2,
			"smart-tabs"
		],
		"no-tabs" : [
			2,
			{
				allowIndentationTabs : true
			}
		],
		"object-property-newline" : [
			"error",
			{
				"allowAllPropertiesOnSameLine" : true
			}
		],
		"object-curly-newline" : [
			"error",
			{
				"consistent" : true
			}
		],
		"object-curly-spacing" : [
			"error",
			"always"
		],
		"array-bracket-spacing" : [
			"error",
			"always"
		],
		"arrow-spacing" : [
			"error",
			{
				"before" : true,
				"after"  : true
			}
		],
		"keyword-spacing" : [
			"error",
			{
				"before" : true,
				"after"  : true
			}
		],
		"jsx-quotes" : [
			"error",
			"prefer-double"
		],
		"space-infix-ops" : [
			"error",
			{
				"int32Hint" : false
			}
		],
		"@typescript-eslint/no-explicit-any" : "error",
		"space-unary-ops"                    : [
			2,
			{
				"words"     : true,
				"nonwords"  : false,
				"overrides" : {
					"new" : false,
					"++"  : true
				}
			}
		],
		"no-empty-function"                    : "off",
		"@typescript-eslint/no-empty-function" : "warn",
		"@typescript-eslint/no-unused-vars"    : "off"
	}
}

