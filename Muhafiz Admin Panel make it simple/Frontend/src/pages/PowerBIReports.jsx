import { useState } from "react";
import Card from "../components/Card";
import "../styles/reports.css";

const PAGES = [
  {
    name: "Overview",
    pageName: "f26d4986084c6856ed5f",
    description: "Summary of total incidents, types, and trends."
  },
  {
    name: "Incident Trends",
    pageName: "page2id_here",
    description: "Visual timeline of incident growth over time."
  },
  {
    name: "Area-wise Breakdown",
    pageName: "page3id_here",
    description: "Compare crime across different towns and districts."
  },
  {
    name: "Monthly Summary",
    pageName: "page4id_here",
    description: "Incidents and hotspots by month."
  }
];

const BASE_URL =
  "https://app.powerbi.com/view?r=eyJrIjoiY2RjOGE4ZmQtNDdjOC00MDdiLWJlNmEtZTM0MGVhNzE4ZTMxIiwidCI6IjI0MWNlN2VlLTVjYmUtNDczNi1hYWM0LWZkOWZmM2NjMWRkMSIsImMiOjl9";

export default function PowerBIReport() {
  const [activePage, setActivePage] = useState(PAGES[0]);

  return (
    <div className="powerbi-page">
      <h2 className="page-title">Crime Analysis Report</h2>
      <p className="subtitle">{activePage.description}</p>

      <div className="tab-nav">
        {PAGES.map((page) => (
          <button
            key={page.pageName}
            onClick={() => setActivePage(page)}
            className={`tab-btn ${page.pageName === activePage.pageName ? "active-tab" : ""}`}
            title={page.description}
          >
            {page.name}
          </button>
        ))}
      </div>

      <Card title={`Power BI: ${activePage.name}`}>
        <div className="report-frame-wrapper">
          <iframe
            title="Power BI Report"
            src={`${BASE_URL}&pageName=${activePage.pageName}`}
            allowFullScreen
            frameBorder="0"
            className="powerbi-iframe"
          ></iframe>
        </div>
      </Card>
    </div>
  );
}
