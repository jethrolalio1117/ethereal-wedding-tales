import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestPage() {
  const navigate = useNavigate();

  console.log('🧪 TestPage rendered successfully!');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Button onClick={() => navigate(-1)} variant="outline">
          ← Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🧪 Test Page</CardTitle>
          <CardDescription>
            If you can see this page, routing is working correctly!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-100 border border-green-400 rounded">
              <h3 className="text-lg font-semibold text-green-800">✅ Success!</h3>
              <p className="text-green-700">
                This test page loaded successfully. This means:
              </p>
              <ul className="list-disc list-inside text-green-700 mt-2">
                <li>React Router (HashRouter) is working</li>
                <li>Component loading is functional</li>
                <li>JavaScript execution is working</li>
                <li>The build deployment is correct</li>
              </ul>
            </div>

            <div className="space-x-2">
              <Button onClick={() => navigate('/')} variant="default">
                → Go Home
              </Button>
              <Button onClick={() => navigate('/debug')} variant="outline">
                → Debug Page
              </Button>
              <Button onClick={() => navigate('/auth')} variant="outline">
                → Auth Page
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 