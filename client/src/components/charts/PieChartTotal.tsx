import { Typography, Box, Stack } from "@mui/material";
import ReactApexChart from 'react-apexcharts';

const PieChartTotal:React.FC<{data?: ITitleTotal[], total:number }> = ({
    data,
    total,
}) => {
    const sortedData = data?.sort((a, b) => a.TotalValue - b.TotalValue);
    const titles = sortedData?.map(item => item.Title)
    const values = sortedData?.map(item => (item.TotalValue/total)*100)
    
    return (
        <Box
            id="chart"
            flex={1}
            display="flex"
            position="relative" 
            bgcolor="rgba(0, 0, 0, 0.4)"
            justifyContent="center" 
            alignItems="center"
            borderRadius="15px"
            minHeight="110px"
            width="fit-content"
        >
            <Box position="absolute" top="0" left="0" p={2}>
                <Typography fontSize={18} fontWeight={600} color="white">
                    Assets by title
                </Typography>
                <Typography fontSize={14} fontWeight={700} color="lightblue" mt={1}>
                    {total}€
                </Typography>
            </Box>
            <Stack direction="column" alignItems="center">
                <ReactApexChart
                    options={{
                        chart: {
                            type: "pie",
                        },
                        dataLabels: { enabled: true },
                        legend: {
                            show: false,
                        },
                        labels: titles,
                    }}
                    series={values}
                    type="pie"
                    width="400px"
                />
            </Stack>
        </Box>
    );
}

export default PieChartTotal;

interface ITitleTotal {
    TotalValue: number;
    Title: string;
}