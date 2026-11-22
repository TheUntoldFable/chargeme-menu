import nextConfig from "eslint-config-next"
import prettierConfig from "eslint-config-prettier"

const destructuringNewline = {
    meta: { type: "layout", fixable: "whitespace" },
    create(context) {
        const sourceCode = context.sourceCode
        return {
            ObjectPattern(node) {
                const { properties } = node
                if (properties.length <= 5) return

                const allOnOneLine = properties.every((p) => p.loc.start.line === properties[0].loc.start.line)
                if (!allOnOneLine) return

                context.report({
                    node,
                    message: "Destructuring with more than 5 properties must have each on its own line.",
                    fix(fixer) {
                        const lines = sourceCode.lines
                        const parentLine = node.loc.start.line - 1
                        const baseIndent = (lines[parentLine] || "").match(/^(\s*)/)[1]
                        const propIndent = baseIndent + "    "

                        const propTexts = properties.map((p) => propIndent + sourceCode.getText(p)).join(",\n")

                        return fixer.replaceText(node, `{\n${propTexts}\n${baseIndent}}`)
                    },
                })
            },
        }
    },
}

// eslint-disable-next-line import/no-anonymous-default-export
export default [
    ...nextConfig,
    prettierConfig,
    {
        plugins: {
            local: { rules: { "destructuring-newline": destructuringNewline } },
        },
        rules: {
            "local/destructuring-newline": "error",
        },
    },
]
