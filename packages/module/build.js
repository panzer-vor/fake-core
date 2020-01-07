const fs = require('fs')
const path = require("path")
const childProcess = require("child_process");
const chalk = require("chalk")
function resolve(relativePath) {
  return path.resolve(__dirname, `./${relativePath}`);
}

const listarray = []

const topPath = 'src'
const copyTopPath = 'lib'

const readFile = (path) => {
  const files = fs.readdirSync(resolve(path))
  files.forEach(v => {
    if (v.indexOf(".") === -1) {
      readFile(path + '/' + v)
    } else if (v.indexOf(".ts") === -1) {
      listarray.push(path + '/' + v)
    }
  })
}
try {
  readFile(`./${topPath}`)
} catch (err) {
  console.log(err)
}


function spawn(command, arguments = [], errorMessage = "") {
  const isWindows = process.platform === "win32"; // spawn with {shell: true} can solve .cmd resolving, but prettier doesn't run correctly on mac/linux
  const result = childProcess.spawnSync(isWindows ? command + ".cmd" : command, arguments, {stdio: "inherit"});
  if (result.error) {
      console.error(result.error);
  }
  if (result.status !== 0) {
      console.error(chalk`{red.bold ${errorMessage}}`);
      console.error(`non-zero exit code returned, code=${result.status}, command=${command} ${arguments.join(" ")}`);
  }
}
try {
  spawn("tsc")
} catch (err) {
  console.log(err)
}



for (const v of listarray) {
  const copyFullPath = v.replace(topPath, copyTopPath)
  const paths = copyFullPath.split("/")
  let pathFull = paths[0]
  for (const path of paths) {
    if (path.indexOf('.ts') !== -1) break
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