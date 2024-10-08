function jsonToEdi204(jsonData) {
    let edi204 = '';
    let segmentCount = 0;

    edi204 += `ST*204*${generateTransactionSetControlNumber()}~\n`;
    segmentCount++;

    const result = processJsonToEdi(jsonData);
    edi204 += result.edi204;
    segmentCount += result.segmentCount;

    edi204 += `SE*${segmentCount}*${generateTransactionSetControlNumber()}~\n`;

    return edi204;
}

function processJsonToEdi(jsonData, parentKey = '') {
    let edi204 = '';
    let segmentCount = 0;

    for (const key in jsonData) {
        const value = jsonData[key];

        if (typeof value === 'object' && !Array.isArray(value)) {
            const nestedResult = processJsonToEdi(value, `${parentKey}${key}.`);
            edi204 += nestedResult.edi204;
            segmentCount += nestedResult.segmentCount;
        } else if (Array.isArray(value)) {
            value.forEach(item => {
                const itemResult = processJsonToEdi({ [key]: item }, `${parentKey}${key}.`);
                edi204 += itemResult.edi204;
                segmentCount += itemResult.segmentCount;
            });
        } else {
            const ediSegment = `${parentKey}${key}*${value}~\n`;
            edi204 += ediSegment;
            segmentCount++;
        }
    }

    return { edi204, segmentCount };
}

function generateTransactionSetControlNumber() {
    return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
}

module.exports = jsonToEdi204;
