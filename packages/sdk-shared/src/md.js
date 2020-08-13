'use strict'
const vm = require('vm')
const fs = require('fs')
// const data = fs.readFileSync('./src/test.md').toString()
const data = fs.readFileSync('../eyes-selenium/README.md').toString()

// const MarkdownIt = require('markdown-it')
// const md = new MarkdownIt()
// const result = md.parse(data)

const unified = require('unified')
const markdown = require('remark-parse')

const result = unified()
  .use(markdown)
  .parse(data)

processNode(result)

// fs.writeFileSync('./src/test.json', JSON.stringify(result, null, 2))

function processNode(node) {
  // console.log('processing', node.type)
  if (node.type === 'html' && /^<!--@test/.test(node.value)) {
    const code = node.value.replace(/^<!--@test\n/, '').replace(/\n-->$/, '')
    // console.log(code)
    vm.runInNewContext(code, {require, process})
  }
  if (node.children) {
    node.children.forEach(processNode)
  }
}
