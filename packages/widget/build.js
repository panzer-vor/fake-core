const fs = require('fs')
const path = require("path")

function resolve(relativePath) {
  return path.resolve(__dirname, `./${relativePath}`);
}
const array = []
//声明文件的集合
const listArray = []

const topPath = 'src'
const copyTopPath = 'lib'

const readFile = (path) => {
  const files = fs.readdirSync(resolve(path))
  files.forEach(v => {
    if (v.indexOf(".") === -1) {
      readFile(path + '/' + v)
    } else if (v.indexOf('.ts') === -1) {
      listArray.push(path + '/' + v)
    }
  })
}
try {
  readFile(`./${topPath}`)
} catch (err) {
  console.log(err)
}

for (const v of listArray) {
  const copyFullPath = v.replace(topPath, copyTopPath)
  const paths = copyFullPath.split("/")
  let pathFull = paths[0]
  for (const path of paths) {
    if (path.indexOf(".ts") !== -1) break
    try {
      fs.readdirSync(pathFull)
      pathFull += `/${path}`
    } catch {
      console.log(pathFull)
      fs.mkdirSync(pathFull)
      pathFull += `/${path}`
    }
  }
  fs.copyFile(v, copyFullPath, function (err) {
    if (err) {
      console.log(err)
      return
    }
    console.log(`${v} copy success !`)
  })
}