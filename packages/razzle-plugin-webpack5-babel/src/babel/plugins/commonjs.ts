import { NodePath, PluginObj, types } from '@babel/core'
import commonjsPlugin from '@babel/plugin-transform-modules-commonjs'

// Handle module.exports in user code
export default function CommonJSModulePlugin(...args: any): PluginObj {
  const commonjs = commonjsPlugin(...args)
  return {
    visitor: {
      Program: {
        exit(path: NodePath<types.Program>, state) {
          let foundModuleExports = false
          path.traverse({
            MemberExpression(expressionPath: any) {
              if (expressionPath.node.object.name !== 'module') return
              if (expressionPath.node.property.name !== 'exports') return
              foundModuleExports = true
            },
          })

          if (!foundModuleExports) {
            return
          }

          commonjs.visitor.Program.exit.call(this, path, state)
        },
      },
    },
  }
}
