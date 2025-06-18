import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2024 Lalio & Villaruz Wedding. All rights reserved.</p>
        
        {/* Admin Section */}
        <div className="mt-4">
          <Button 
            onClick={() => {
              console.log('🔐 Admin button clicked - navigating to auth');
              navigate('/auth');
            }}
            variant="outline" 
            size="sm"
            className="hover:bg-white hover:text-gray-900 transition-colors"
          >
            🔐 Admin Login
          </Button>
        </div>


      </div>
    </footer>
  );
}
