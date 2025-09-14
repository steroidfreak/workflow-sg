import { Link as RouterLink } from 'react-router-dom'
import { Grid, Card, CardActionArea, CardContent, Typography, CardMedia } from '@mui/material'

export default function Demos() {
    const demos = [
        { title: 'Demo: Summarize text', description: 'Summarize a paragraph via /api/demo/summarize.', path: '/demos/summarize', image: '/summarize-placeholder.png' },
        { title: 'Demo: WhatsApp agent', description: 'Chat with an AI via /api/demo/whatsapp.', path: '/demos/whatsapp', image: '/whatsapp-agent.png' },
        { title: 'Demo: n8n chat', description: 'Chat with an n8n workflow via /api/n8n/chat.', path: '/demos/n8n-chat', image: '/summarize-placeholder.png' }
    ]

    return (
        <Grid container spacing={2}>
            {demos.map((demo) => (
                <Grid item xs={12} sm={6} md={4} key={demo.path}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardActionArea
                            component={RouterLink}
                            to={demo.path}
                            sx={{ height: '100%', textDecoration: 'none', color: 'inherit' }}
                        >
                            {/* Responsive image that scales on mobile but stays small on desktop */}
                            <CardMedia
                                component="img"
                                src={demo.image}
                                alt={demo.title}
                                loading="lazy"
                                sx={{
                                    // Grow on phones, cap on larger screens
                                    width: { xs: 'clamp(96px, 45vw, 200px)', sm: 160, md: 150 },
                                    height: 'auto',
                                    display: 'block',
                                    mx: 'auto',
                                    mt: 2,
                                    mb: 1.5,
                                    objectFit: 'contain'
                                }}
                            />
                            <CardContent sx={{ pt: 0 }}>
                                <Typography variant="h6" component="h2">{demo.title}</Typography>
                                <Typography variant="body2" color="text.secondary">{demo.description}</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
        </Grid>
    )
}
