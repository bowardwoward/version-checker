import express from 'express';
import cors from 'cors';
import versionRoutes from './router';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', versionRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something broke!'
  });
});

export default app;