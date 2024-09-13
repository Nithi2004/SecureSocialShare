import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, Code } from '@chakra-ui/react';
import React from 'react';
import JsonView from 'react18-json-view';

interface FileDataViewerProps {
    title: string;
    fileData: string;
}

const FileDataViewer: React.FC<FileDataViewerProps> = ({ title, fileData }) => {
    // Implement your component logic here

    return (
        <Accordion allowToggle>
            <AccordionItem>
                <h2>
                    <AccordionButton>
                        <Box flex="1" textAlign="left">
                            {title}
                        </Box>
                    </AccordionButton>
                </h2>
                <AccordionPanel>
                    {
                        fileData === "" ?
                            <Code>Empty</Code> :
                            <pre><JsonView src={JSON.parse(fileData)}></JsonView></pre>
                    }
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
};

export default FileDataViewer;