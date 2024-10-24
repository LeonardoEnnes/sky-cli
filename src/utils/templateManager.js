import fs from 'fs';
import path from 'path';
import os from 'os';

class TemplateManager {
    constructor(templatesDir) {
        this.templatesDir = templatesDir;
    }

    loadTemplate(templateName) {
        const templatePath = path.join(this.templatesDir, `${templateName}.json`);
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template ${templateName} does not exist.`);
        }
        return JSON.parse(fs.readFileSync(templatePath, 'utf8'));
    }

    createTemplateStructure(template, targetDir) {
        // Define o diretório de destino como a área de trabalho do usuário
        const desktopDir = path.join(os.homedir(), 'OneDrive', 'Área de Trabalho'); // Caminho para a área de trabalho
        const finalTargetDir = path.join(desktopDir, template.name); // Usar o nome do template como subdiretório

        // Create directories
        template.directories.forEach(dir => {
            const dirPath = path.join(finalTargetDir, dir);
            fs.mkdirSync(dirPath, { recursive: true });
        });

        // Create files
        for (const [fileName, content] of Object.entries(template.files)) {
            const filePath = path.join(finalTargetDir, fileName);
            fs.writeFileSync(filePath, content, 'utf8');
        }

        console.log(`Template ${template.name} created successfully in ${finalTargetDir}`);
    }
}

export default TemplateManager;
