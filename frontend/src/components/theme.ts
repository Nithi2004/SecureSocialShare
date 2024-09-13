import { extendTheme } from '@chakra-ui/react'
import '@fontsource/montserrat'
import '@fontsource/hind-madurai';

const theme = extendTheme({
    fonts: {
        heading: `'Montserrat', sans-serif`,
        body: `'Hind Madurai', sans-serif`,
    },
})

export default theme