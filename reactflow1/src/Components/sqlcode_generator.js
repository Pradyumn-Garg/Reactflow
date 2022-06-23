export default function generatePythonCode(structuredData, appName) {
    let result = ''
    console.log('the structured data is:', structuredData)

    for (let obj of structuredData) {
        let i=0;
        result += 'CREATE TABLE	`'+obj.name+obj.id.substring(3)+ '`(\n'
        for(let obj2 in obj.config){
            if(i%3==0){
                if(i>2){
                    result+= ',\n'
                }
                result+= '\t'+obj.config[obj2].value+' '
            }
            if(i%3==1){
                result+= obj.config[obj2].value+' '
            }
            if(i%3==2){
                result+= obj.config[obj2].value
            }
            i++
        }
        result+= '\n);\n\n'
        console.log('break')
    }
    console.log("The resultant sql file is:", result)

    return result;
}