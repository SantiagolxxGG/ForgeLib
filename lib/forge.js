const fs = require('fs');
const axios = require('axios');
const { exec } = require('child_process');
const path = require('path');

// La URL de Forge con la versi贸n indicada
const FORGE_URL = "https://files.minecraftforge.net/maven/net/minecraftforge/forge/{version}/forge-{version}-installer.jar";

class Forge {
    async download(version, type = 'latest', installPath = './') {
        const finalVersion = await this.resolveVersion(version, type);
        const installerPath = await this.downloadForge(finalVersion);
        await this.runInstaller(installerPath, installPath);
    }

    async resolveVersion(version, type) {
        // Reemplaza el espacio en la versi贸n por un guion
        const formattedVersion = version.replace(' ', '-');
        return formattedVersion; // Retorna la versi贸n formateada
    }

    async downloadForge(version) {
        const url = FORGE_URL.replace(/{version}/g, version);
        const outputPath = path.join(__dirname, `forge-${version}-installer.jar`);

        console.log(`Descargando Forge Loader de ${url}...`);

        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
        });

        const writer = fs.createWriteStream(outputPath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(outputPath));
            writer.on('error', reject);
        });
    }

    runInstaller(installerPath, installPath) {
        console.log(`Ejecutando el instalador de Forge: ${installerPath}`);

        // Comando modificado para instalar el cliente de Forge
        const command = `java -jar "${installerPath}" --installClient "${installPath}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error al ejecutar el instalador: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Error: ${stderr}`);
                return;
            }
            console.log(`Instalaci贸n completada: ${stdout}`);
        });
    }
}

module.exports = new Forge();