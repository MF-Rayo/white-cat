import { DataTable } from "metricui"; 
import { SquareArrowOutUpRight } from "lucide-react";
import { CustomBadge } from "@/components/ui/badge/Badge";
import { hashToColor }  from "@/lib/hashColor"

const NEWS_COLUMNS = [
    { 
        key: "source", header: "Source", 
        render: (params) => {
        const color = hashToColor(params);
            return (<CustomBadge color={color} title={params}/>);
        }  
    },
    { key: "title", header: "Title",
        render: (params) => {
        const text = params.substring(0, 40) + "...";
            return (<p>{text}</p>);
        }   
    },
    { key: "source_of_information", header: "Post",
        render: (params) => {
            return (<SquareArrowOutUpRight width={15} 
                className="hover:text-(--primary-color) transition-colors duration-200"/>
            );
        }  
    }
];

const POST_COLUMNS = [
    { key: "source", header: "Source",
        render: (params) => {
        const color = hashToColor(params);
            return (<CustomBadge color={color} title={params}/>);
        }
    },
    { 
        key: "group_name", header: "Group",
        render: (params) => {
        const color = hashToColor(params);
            return (<CustomBadge color={color} title={params}/>);
        }  
    },
    { key: "victim", header: "Victim", type: "text" },
    { key: "post_url", header: "Post",
        render: (params) => {
            return (<SquareArrowOutUpRight width={15} 
                className="hover:text-(--primary-color) transition-colors duration-200"/>
            );
        }  
    }
    ];

const NEWS_DETAILS = [
    { key: "description", label: "Description" },
];

const POST_DETAILS = [
    { key: "activity", label: "Activity" },
    { key: "description", label: "Description" },
];

const isHttpUrl = (url) => /^https?:\/\//i.test(url ?? "");

function LinkedTable({ data, title, columns, urlKey }) {
    const handleRowClick = (row) => {
        const url = row?.[urlKey];
        if (isHttpUrl(url)) window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <DataTable
            searchable
            title={title}
            data={data}
            columns={columns}
            pageSize={5}
            onRowClick={handleRowClick}
            className="card-metricui h-full overflow-hidden"
        />
    );
}

export function TableNew({ dataTable }) {
    return (
        <LinkedTable
            data={dataTable}
            title="Today's Cybersecurity News"
            columns={NEWS_COLUMNS}
            urlKey="source_of_information"
            details={NEWS_DETAILS}
        />
    );
}

export function TablePost({ dataTable }) {
    return (
        <LinkedTable
            data={dataTable}
            title="Today's Posts"
            columns={POST_COLUMNS}
            urlKey="post_url"
            details={POST_DETAILS}
        />
    );
}