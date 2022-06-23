export default function generatePythonCode(structuredData, appName) {
    let result = ''
    console.log('the structured data is:', structuredData)

    for (let obj of structuredData) {
        console.log("type of node:", obj.type)
        console.log("id of node:", obj.id)
        if (obj.type === "source node") {
            result += 'CREATE TABLE	'
            result += '`' + obj.name + obj.id[8] + '`(\n'
            result += '\t`' + obj.config.name.value + '` ' + obj.config.path.value + ' ' + obj.config.header.value + "\n"
            result += ');' + "\n\n"
        }

        if (obj.type === "destination node") {
            result += 'CREATE TABLE	'
            result += '`' + obj.name + obj.id[8] + '`(\n'
            result += '\t`' + obj.config.name.value + '` ' + obj.config.path.value + ' ' + obj.config.header.value + "\n"
            result += ');' + "\n\n"
        }
    }
    console.log("The resultant sql file is:", result)

    return result;
}