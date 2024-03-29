import ReactApexChart from 'react-apexcharts';
import { Typography, Box, Stack } from "@mui/material";
import { ArrowCircleUp, Summarize } from '@mui/icons-material';
import { TotalValueOptions } from './chart.config';

const TotalValue:React.FC<{data?:IMonthTotal[]}> = ({
    data
})=>{
    const values = data?.map(item => item.totalValue)??[];

    return(
        <Box
            p={4}
            flex={1}
            bgcolor="rgba(0, 0, 0, 0.4)"
            id="chart"
            display="flex"
            flexDirection="column"
            borderRadius="15px"
        >
            <Typography fontSize={18} fontWeight={600} color="white">
                Total amount invested
            </Typography>

            <Stack my="20" direction="row" gap={4} flexWrap="wrap">
                <Typography fontSize={28} fontWeight={700} color="lightblue">
                    €{Math.max(...values)}
                </Typography>
                <Stack direction="row" alignItems="center" gap={1}>
                    {/*button here for display aggregated by year */}
                    <ArrowCircleUp sx={{
                        fontSize: 25,
                        color: "lightblue",
                    }} />
                    <Stack>
                        {/*button here for display aggregated by year */}
                    </Stack>
                </Stack>
            </Stack>
            <ReactApexChart
                options={TotalValueOptions}
                series={[{data: values}]}
                type="bar"
                height={310}
                width="100%" 
            />
        </Box>
    )
}

export default TotalValue;

interface IMonthTotal {
    month: string;
    totalValue: number;
}