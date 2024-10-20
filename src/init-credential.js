import original from './adminsdk.json' assert { type: "json" };
import fs from 'fs';


const target = {};

for (const key in original) {
    target[`${key}`] = ""
}

const init = async () => {
    
    await fs.writeFile('./initial.json', JSON.stringify(target), { encoding: 'utf-8' }, (err) => {
        if (err)
            console.log(err);
        else {
            console.log("File written successfully\n");
        }
    }
    )
}

init();
