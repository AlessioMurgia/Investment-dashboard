import { Typography, Box, Stack } from "@mui/material";
import { useApiUrl, useCustom, useGetIdentity } from "@refinedev/core";

import {
    AssetSector,
    PieChart,
    TotalValue,
    PieChartTotal
} from "../components"

const Home = () => {
    const API_URL = useApiUrl('plotInterrogations');
    const { data: user } = useGetIdentity<User>();

//ajust interfaces and import them && fix all get with user email
    
    const { data: data4Sector, isLoading: isLoading4Sector } = useCustom<SectorTotal[]>({
        url: `${API_URL}/total-by-sector`,
        method: "get",
        config: {
            query: {
                email: user?.email
              },
          },
    });

    const { data: data4Total, isLoading: isLoading4Total } = useCustom<ITotal[]>({
        url: `${API_URL}/total`,
        method: "get",
        config: {
            query: {
                email: user?.email
              },
          },
    });

    const { data: data4Type, isLoading: isLoading4Type } = useCustom<ITypeTotal[]>({
        url: `${API_URL}/total-by-type`,
        method: "get",
        config: {
            query: {
                email: user?.email
              },
          },
    });

    const { data: data4Title, isLoading: isLoading4Title } = useCustom<ITitleTotal[]>({
        url: `${API_URL}/total-by-title`,
        method: "get",
        config: {
            query: {
                email: user?.email
              },
          },
    });

    const { data: data4Month, isLoading: isLoading4Month } = useCustom<IMonthTotal[]>({
        url: `${API_URL}/month-of-current-year`,
        method: "get",
        config: {
            query: {
                email: user?.email
              },
          },
    });

    const totalSum = data4Total?.data[0].totalValue ?? NaN;

    //fix the import of colors
    const colors = ["#44738B", '#00945A', '#820094', '#B46A00'];

    return (
        <Box>
            <Typography fontSize={25} fontWeight={700} color="white">
                Dashboard
            </Typography>

            <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
                {(isLoading4Type || isLoading4Total) ? (
                <>Loading...</>
                ) : (
                    data4Type?.data.map((typeTotal, index) => (
                        <PieChart
                            key={typeTotal.type._id}
                            title={typeTotal.type.title}
                            value={typeTotal.totalValue}
                            series={[(typeTotal.totalValue / totalSum) * 100, 100-((typeTotal.totalValue / totalSum) * 100) ]}
                            colors={[colors[index], "#828282"]}
                        />
                )))}
            </Box>
            <Stack mt="25px" width="100%" direction={{ xs: "column", lg: "row" }} gap={4}>
                {(isLoading4Title || isLoading4Title) ? (
                <>Loading</>) : (
                    <PieChartTotal data={data4Title?.data} total={totalSum}/>
                )}

                {(isLoading4Sector || isLoading4Total) ? (
                <>Loading...</>
                ) : (
                    <AssetSector sectorTotals={data4Sector?.data} totalSum={totalSum} />
                )}
            </Stack>
            <Stack mt="25px" width="100%" direction={{ xs: "column", lg: "row" }} gap={4}>
                {(isLoading4Month) ? (
                <>Loading...</>) : (
                    <TotalValue data={data4Month?.data} />
                )}
            </Stack>
        </Box>
    )
}

export default Home;

interface SectorTotal {
    totalValue: number;
    sector: {
        _id: string;
        title: string;
    };
}

interface ITypeTotal {
    totalValue: number;
    type: {
        _id: string;
        title: string;
    };
}

interface ITotal {
    _id: number;
    totalValue: number;
}
interface User {
    email: string;
  };

interface ITitleTotal {
    TotalValue: number;
    Title: string;
}

interface IMonthTotal {
    month: string;
    totalValue: number;
}