module.exports = (doc) => (
`<p align="right"><sub><a href="http://jsig.biz/">JSIG SIGNATURE:</a></sub></p>

<h3><pre>
${doc.data.tags
  .find(tag => tag.type === 'jsig')
  .string
  .replace(/^  /mg, '')
}
</pre></h3>

${doc.data.description.full}
`);
