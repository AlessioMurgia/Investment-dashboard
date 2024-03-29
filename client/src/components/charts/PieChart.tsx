import { Typography, Box, Stack } from "@mui/material";

import { PieChartProps } from '../../interfaces/home';
import ReactApexChart from 'react-apexcharts';

const PieChart = ({title, value, series, colors}:PieChartProps)=>{
    return(
        <Box 
            id="chart" 
            flex={1} display="flex" 
            bgcolor="rgba(0, 0, 0, 0.4)" 
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            pl={3.5}
            py={2}
            gap={2}
            borderRadius="15px"
            minHeight="110px"
            width="fit-content"
        >
            <Stack direction="column">
                <Typography fontSize={14} color="#44738B">
                    Value in: {title}
                </Typography>
                <Typography fontSize={14} fontWeight={700} color="lightblue" mt={1}>
                    {value}€
                </Typography>
                <ReactApexChart
                    options={{
                        chart: {
                            type: "donut",
                        },
                        dataLabels: {enabled: false},
                        colors: colors,
                        legend: {
                            show: false,
                        },
                    }}
                    series={series}
                    type="donut"
                    width="120px"
                />
            </Stack>
        </Box>
    )
}

export default PieChart;