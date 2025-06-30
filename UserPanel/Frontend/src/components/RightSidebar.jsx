import { FiTrendingUp, FiMessageSquare } from 'react-icons/fi';

export default function RightSidebar() {
  const trendingThreads = [
    {
      id: 1,
      tag: 'General Discussions',
      title: 'Suspicious incidents in Lyari',
      comments: 142,
      category: 'crime'
    },
    {
      id: 2,
      tag: 'Safety Tips',
      title: 'How to secure your home during holidays',
      comments: 89,
      category: 'safety'
    },
    {
      id: 3,
      tag: 'Crime Reports',
      title: 'Plane crash in Baldia',
      comments: 245,
      category: 'alert'
    },
    {
      id: 4,
      tag: 'Community Watch',
      title: 'Neighborhood watch program starting next month',
      comments: 56,
      category: 'community'
    }
  ];

  return (
    <aside className="right-sidebar">
      <div className="sidebar-header">
        <FiTrendingUp />
        <h4>Trending Threads</h4>
      </div>
      
      <ul className="trending-list">
        {trendingThreads.map(thread => (
          <li key={thread.id} className={`trending-item ${thread.category}`}>
            <div className="thread-tag">
              {thread.tag}
            </div>
            <h5>{thread.title}</h5>
            <div className="thread-meta">
              <span className="comments">
                <FiMessageSquare /> {thread.comments}
              </span>
              <button className="join-discussion">Join Discussion</button>
            </div>
          </li>
        ))}
      </ul>
      
     <div className="community-stats" style={{ marginTop: '24px' }}>
  {[ 
    { title: 'Community Reports', value: '1,245', change: '↑ 12% this week' },
    { title: 'Active Members', value: '3,891', change: '↑ 5% this month' }
  ].map((stat, index) => (
    <div
      key={index}
      className="stat-card"
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        padding: '16px 20px',
        marginBottom: '16px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
      }}
    >
      <h5 style={{ margin: '0 0 8px', fontSize: '16px', color: '#333' }}>{stat.title}</h5>
      <div className="stat-value" style={{ fontSize: '24px', fontWeight: 'bold', color: '#F29DF7FF' }}>
        {stat.value}
      </div>
      <div className="stat-change" style={{ fontSize: '13px', color: '#28a745', marginTop: '4px' }}>
        {stat.change}
      </div>
    </div>
  ))}
</div>

    </aside>
  );
}