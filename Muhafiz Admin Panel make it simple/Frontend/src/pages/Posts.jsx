import { useState } from 'react';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import '../styles/posts.css';

const Posts = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');

  const posts = [
    { 
      id: 1, 
      title: 'Safety concerns in downtown area', 
      author: 'John Doe', 
      date: '2023-06-15', 
      replies: 12, 
      views: 145, 
      status: 'Published',
      content: 'I\'ve noticed several suspicious activities in the downtown area recently. Has anyone else experienced this?'
    },
    { 
      id: 2, 
      title: 'Neighborhood watch meeting', 
      author: 'Jane Smith', 
      date: '2023-06-14', 
      replies: 8, 
      views: 98, 
      status: 'Published',
      content: 'We\'re organizing a neighborhood watch meeting next Tuesday at 7 PM. All are welcome to join!'
    },
    { 
      id: 3, 
      title: 'Report of stolen packages', 
      author: 'Bob Johnson', 
      date: '2023-06-13', 
      replies: 5, 
      views: 76, 
      status: 'Pending Review',
      content: 'Several packages were stolen from my porch yesterday. Be careful with deliveries!'
    },
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = currentFilter === 'all' || 
                         post.status.toLowerCase().replace(' ', '-') === currentFilter;
    return matchesSearch && matchesFilter;
  });

  const handleViewPost = (postId) => {
    const post = posts.find(p => p.id === postId);
    setSelectedPost(post);
    setShowModal(true);
  };

  return (
    <div className="posts-page">
      <h2 className="page-title">Manage Community Posts</h2>
      
      <Card>
        <div className="posts-header">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
              onClick={() => setCurrentFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${currentFilter === 'published' ? 'active' : ''}`}
              onClick={() => setCurrentFilter('published')}
            >
              Published
            </button>
            <button 
              className={`filter-btn ${currentFilter === 'pending-review' ? 'active' : ''}`}
              onClick={() => setCurrentFilter('pending-review')}
            >
              Pending
            </button>
          </div>
        </div>

        <DataTable
          columns={['Title', 'Author', 'Date', 'Replies', 'Views', 'Status']}
          data={filteredPosts.map(post => ({
            id: post.id, 
            Title: post.title,
            Author: post.author,
            Date: post.date,
            Replies: post.replies,
            Views: post.views,
            Status: <span className={`status-badge ${post.status.toLowerCase().replace(' ', '-')}`}>
              {post.status}
            </span>
          }))}
          actions={(id) => (
            <>
              <button 
                className="view" 
                title="View"
                onClick={() => handleViewPost(id)}
              >
                <i className="fas fa-eye"></i>
              </button>
              <button 
                className="edit" 
                title="Edit"
                onClick={() => handleViewPost(id)}
              >
                <i className="fas fa-edit"></i>
              </button>
              <button 
                className={posts.find(p => p.id === id).status === 'Published' ? 'unpublish' : 'publish'}
                title={posts.find(p => p.id === id).status === 'Published' ? 'Unpublish' : 'Publish'}
              >
                {posts.find(p => p.id === id).status === 'Published' ? (
                  <i className="fas fa-eye-slash"></i>
                ) : (
                  <i className="fas fa-eye"></i>
                )}
              </button>
              <button 
                className="delete" 
                title="Delete"
              >
                <i className="fas fa-trash"></i>
              </button>
            </>
          )}
        />
      </Card>

      {showModal && selectedPost && (
        <Modal 
          title={selectedPost.title} 
          onClose={() => setShowModal(false)} 
          show={showModal}
          width="800px"
        >
          <div className="post-details">
            <div className="post-meta">
              <span className="author">
                <i className="fas fa-user"></i> {selectedPost.author}
              </span>
              <span className="date">
                <i className="fas fa-calendar-alt"></i> {selectedPost.date}
              </span>
              <span className={`status ${selectedPost.status.toLowerCase().replace(' ', '-')}`}>
                {selectedPost.status}
              </span>
            </div>
            <div className="post-content">
              <p>{selectedPost.content}</p>
            </div>
            <div className="post-stats">
              <span><i className="fas fa-comment"></i> {selectedPost.replies} replies</span>
              <span><i className="fas fa-eye"></i> {selectedPost.views} views</span>
            </div>
          </div>
          <div className="post-actions">
            <button className="btn btn-primary">
              <i className="fas fa-reply"></i> Reply
            </button>
            <button className="btn btn-danger">
              <i className="fas fa-trash"></i> Remove Post
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Posts;