module.exports = (doc) => (
`
#####  ${doc.data.description.summary}

${doc.data.tags
  .filter(tag => tag.type === 'jsig')
  .map(tag => (
`\`\`\`js
${
    tag.string.replace(/^  /mg, '')
}
\`\`\`
` ))}
${doc.data.description.body}

`);
