import fs from 'fs'

function hotRestart() {
    // We need to create a 'restart' file in the root directory
    // This will be used to determine if we ran !ectoRestart

    // If the file exists, we know we are ran !ectoRestart

    // Create the file
    fs.writeFile('./restart', '', (err) => {
        if(err) {
            console.log(err)
        }
    })
}

function checkForHotRestart () {
    // Check if the file exists
    let fileExists = fs.existsSync('./restart')

    // Delete the file
    fs.unlink('./restart', (err) => {
        if(err) {
            console.log(err)
        }
    })

    // Return the answer
    return fileExists

}

export { hotRestart, checkForHotRestart }