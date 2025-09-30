# Analytics System Documentation

## Overview

The Dreamalign-Lite analytics system provides comprehensive user behavior tracking and insights for the career development platform. It's designed to be privacy-focused, performant, and developer-friendly.

## Features

### Core Analytics
- **Page Views**: Automatic tracking of page navigation
- **User Actions**: Button clicks, form submissions, feature usage
- **Session Management**: User session tracking with duration
- **Performance Metrics**: Page load times and user engagement
- **Error Tracking**: JavaScript errors and API failures

### User Journey Tracking
- **Onboarding Flow**: Track completion rates and drop-off points
- **Interview Sessions**: Performance metrics and completion rates
- **Career Path Exploration**: User interests and path selections
- **Profile Management**: Profile completion and updates

### Privacy & Compliance
- **No PII Storage**: Only anonymized user identifiers
- **Local Storage**: Debug logs stored locally in development
- **Opt-out Support**: Easy to disable for privacy-conscious users
- **GDPR Ready**: Designed with privacy regulations in mind

## Implementation

### Basic Usage

```typescript
import { useAnalytics } from '@/lib/analytics'

function MyComponent() {
  const analytics = useAnalytics()
  
  const handleButtonClick = () => {
    analytics.track('button_clicked', {
      button_name: 'start_interview',
      page: 'dashboard'
    })
  }
  
  return <button onClick={handleButtonClick}>Start Interview</button>
}
```

### Available Methods

#### `track(event, properties)`
Track custom events with optional properties.

```typescript
analytics.track('interview_completed', {
  score: 8.5,
  duration: 1200,
  job_role: 'Software Engineer',
  interview_type: 'technical'
})
```

#### `page(pageName, properties)`
Track page views (automatically called by the system).

```typescript
analytics.page('dashboard', {
  user_type: 'premium',
  feature_flags: ['new_ui', 'beta_features']
})
```

#### `identify(userId, traits)`
Associate analytics with a specific user.

```typescript
analytics.identify(user.id, {
  email: user.email,
  plan: 'premium',
  signup_date: user.createdAt
})
```

#### `getDebugInfo()`
Get debug information (development only).

```typescript
const debugInfo = analytics.getDebugInfo()
console.log('Analytics Status:', debugInfo)
```

## Event Categories

### Navigation Events
- `page_viewed` - User navigates to a new page
- `tab_changed` - User switches tabs within a page
- `modal_opened` - User opens a modal or dialog

### User Actions
- `button_clicked` - Any button interaction
- `form_submitted` - Form completion
- `download_started` - File or resource download
- `search_performed` - Search functionality usage

### Feature Usage
- `interview_started` - User begins an interview
- `interview_completed` - User completes an interview
- `career_path_viewed` - User explores a career path
- `profile_updated` - User modifies their profile

### Engagement
- `session_started` - User begins a new session
- `session_ended` - User ends their session
- `feature_discovered` - User finds a new feature
- `achievement_unlocked` - User earns an achievement

## Configuration

### Environment Variables

```bash
# Analytics Configuration
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_ANALYTICS_DEBUG=false
ANALYTICS_API_KEY=your_api_key_here
```

### Custom Configuration

```typescript
// lib/analytics.ts
const analyticsConfig = {
  enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true',
  debug: process.env.NODE_ENV === 'development',
  apiEndpoint: '/api/analytics',
  batchSize: 10,
  flushInterval: 5000
}
```

## Development Tools

### Debug Component
The `AnalyticsDebug` component provides real-time analytics monitoring in development:

- **Event Log**: View recent events in real-time
- **Session Info**: Current session details
- **Export Logs**: Download analytics data as JSON
- **Clear Data**: Reset local analytics storage

### Console Logging
In development mode, all analytics events are logged to the console:

```
[Analytics] Event tracked: interview_started
[Analytics] Properties: { user_id: "123", job_role: "Engineer" }
```

## Data Flow

1. **Event Triggered**: User performs an action
2. **Analytics Hook**: `useAnalytics` captures the event
3. **Local Storage**: Event stored locally (development)
4. **API Call**: Event sent to `/api/analytics` endpoint
5. **Processing**: Server processes and forwards to analytics service
6. **Storage**: Event stored in analytics database

## Performance Considerations

### Batching
Events are batched to reduce API calls:
- Default batch size: 10 events
- Flush interval: 5 seconds
- Immediate flush for critical events

### Lazy Loading
Analytics code is loaded asynchronously to avoid blocking the main thread.

### Error Handling
Failed analytics calls don't affect user experience:
- Silent failures in production
- Retry logic for temporary failures
- Fallback to local storage if API unavailable

## Privacy & Security

### Data Minimization
- Only collect necessary data
- No sensitive information in event properties
- Automatic PII detection and filtering

### User Consent
- Respect user privacy preferences
- Easy opt-out mechanism
- Clear data usage policies

### Security
- HTTPS-only transmission
- API key authentication
- Rate limiting on analytics endpoints

## Integration Examples

### Onboarding Flow
```typescript
// Track onboarding progress
analytics.track('onboarding_step_completed', {
  step: 'interests_selection',
  step_number: 2,
  total_steps: 5,
  completion_time: 45000
})
```

### Interview System
```typescript
// Track interview performance
analytics.track('interview_question_answered', {
  question_id: 'q_123',
  question_type: 'behavioral',
  response_time: 30000,
  confidence_level: 'high'
})
```

### Career Exploration
```typescript
// Track career path interest
analytics.track('career_path_explored', {
  path_id: 'software_engineer',
  match_score: 92,
  time_spent: 120000,
  actions_taken: ['view_details', 'save_path']
})
```

## Troubleshooting

### Common Issues

1. **Events Not Tracking**
   - Check if analytics is enabled in environment variables
   - Verify API endpoint is accessible
   - Check browser console for errors

2. **Debug Component Not Showing**
   - Ensure you're in development mode
   - Check if component is imported in layout
   - Verify NODE_ENV is set to 'development'

3. **Performance Issues**
   - Reduce batch size if memory usage is high
   - Increase flush interval for less frequent API calls
   - Consider implementing event sampling for high-traffic events

### Debug Commands

```typescript
// Check analytics status
console.log(analytics.getDebugInfo())

// Force flush pending events
analytics.flush()

// Clear local storage
localStorage.removeItem('analytics_log')
```

## Future Enhancements

### Planned Features
- **A/B Testing**: Built-in experiment tracking
- **Funnel Analysis**: Conversion tracking across user journeys
- **Real-time Dashboard**: Live analytics visualization
- **Predictive Analytics**: ML-powered user behavior predictions

### Integration Roadmap
- **PostHog**: Complete event tracking and analysis
- **Mixpanel**: Advanced user segmentation
- **Amplitude**: Product analytics and insights
- **Custom Dashboard**: Internal analytics visualization

## Support

For questions or issues with the analytics system:
1. Check this documentation
2. Review the debug component output
3. Check browser console for errors
4. Contact the development team

---

*Last updated: January 2025*
