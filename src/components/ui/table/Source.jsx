import { DataTable, Sparkline } from "metricui";

export function TopSource({ data }){
    const formattedData = data?.map((item) => ({
        country: item.country,
        total: item.count,
        line: item.count
    }));
    
    return(
        <DataTable
        title="TOP IOC SOURCES"
        data={formattedData}
        pageSize={5}
        className="card-metricui"
        columns={[
        {key: 'country', label: 'Country', type: 'text'},
        {
            key: 'line',
            label: 'Line',
            render: (row) => (
                <div className="w-full h-6">
                <Sparkline data={[25, 50, 75, 100, + row]} type="bar" color={["var(--primary-color)"]}/>
                </div>
            ),
        },
        {key: 'total', label: 'Total', type: 'number'}]
        }/>
    )
}