import React from 'react';
import { Box, Typography, Stack } from '@mui/material';

interface SectorTotal {
    totalValue: number;
    sector: {
        _id: string;
        title: string;
    };
}

interface ProgressBarProps {
    title: string;
    percentage: string;
    color: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ title, percentage, color }) => {
    return (
        <Box width="100%">
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography fontSize={16} fontWeight={500} color="white">
                    {title}
                </Typography>
                <Typography fontSize={16} fontWeight={500} color="white">
                    {percentage}%
                </Typography>
            </Stack>
            <Box 
                mt={2} 
                position="relative" 
                width="100%" 
                height="8px" 
                borderRadius={1} 
                bgcolor="rgba(0, 0, 0, 1)"
            >
                <Box
                    width={`${percentage}%`}
                    bgcolor={color}
                    position="absolute"
                    height="100%"
                    borderRadius={1}
                />
            </Box>
        </Box>
    );
};

const AssetSector: React.FC<{ sectorTotals?: SectorTotal[]; totalSum: number }> = ({
    sectorTotals,
    totalSum,
}) => {
    const colors = ['blue', 'green', 'yellow', 'orange', 'purple', 'red', 'pink', 'cyan', 'magenta', 'lime'];
    
    return (
        <Box
            p={4}
            bgcolor="rgba(0, 0, 0, 0.4)"
            id="chart"
            display="flex"
            minWidth={490}
            flexDirection="column"
            borderRadius="15px"
        >
            <Typography fontSize={18} fontWeight={600} color="white">
                Assets Sector
            </Typography>
            <Stack my="20px" direction="column" gap={4}>
                {sectorTotals?.map((sectorTotal, index) => (
                    <ProgressBar
                        key={sectorTotal.sector._id}
                        title={sectorTotal.sector.title}
                        percentage={((sectorTotal.totalValue / totalSum) * 100).toFixed(2)}
                        color={index < colors.length ? colors[index] : 'rgb(255, 255, 255)'}
                    />
                ))}
            </Stack>
        </Box>
    );
};

export default AssetSector;
