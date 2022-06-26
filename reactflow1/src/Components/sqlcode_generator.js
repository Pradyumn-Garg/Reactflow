export default function generatePythonCode(structuredData, appName) {
    let result = ''
    let primary = []
    let foreign = []
    let j=0, k=0
    console.log('the structured data is:', structuredData)

    for (let obj of structuredData) {
        let i=0;
        let temp=''
        result += 'CREATE TABLE	`'+obj.name+ '`(\n'
        for(let obj2 in obj.config){
            if(i%3==0){
                if(i>2){
                    result+= ',\n'
                }
                result+= '\t'+obj.config[obj2].value+' '
                temp=obj.config[obj2].value
            }
            if(i%3==1){
                result+= obj.config[obj2].value+' NOT NULL '
            }
            if(i%3==2){
                if(obj.config[obj2].value=="FOREIGN KEY"){
                    foreign[j]=[obj.name,temp]
                    j++
                    i++
                    continue
                }
                if(obj.config[obj2].value=="PRIMARY KEY"&& obj.type=="source node"){
                    primary[k]=[obj.name,temp]
                }
                if(obj.config[obj2].value=="PRIMARY KEY"){
                    result+= obj.config[obj2].value
                }
            }
            i++
        }
        result+= '\n);\n\n'
        // console.log(foreign)
        // console.log('break')
    }
    for(let a of foreign){
        for(let b of primary){
            if(a[1]==b[1]){
                result+= 'ALTER TABLE\n\t`'+a[0]+'` ADD CONSTRAINT `'+a[0]+'_'+b[1]+'_foreign` FOREIGN KEY(`'+b[1]+'`) REFERENCES `'+a[0]+'`(`'+a[1]+'`);\n'
            }
        }
    }
    console.log("The resultant sql file is:", result)

    return result;
}