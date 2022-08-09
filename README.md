# sauce-slack-webhook

This Cloud Run service written in nodejs receives Sauce Labs webhooks, and converts and sends them to a Slack Incoming Webhook URL.
The instructions below takes you through creating the Slack Incoming Webhook, deploying the service to Google Cloud, and hooking it up with Sauce Labs' webhook mechanism.

## Instructions
1. Create a Slack Incoming Webhook
2. Build and deploy the service to Google Cloud
3. Integrate with Sauce Labs Webhook

## 1. Create Slack Incoming Webhook
- Add apps (under Apps at bottom)
- Search 'Incoming Webhooks'
- Click Add under 'Incoming Webhooks' under Available Apps
- Click 'Add to Slack'
- Select a channel
- Click 'Add Incoming Webhooks integration'
- Note the Webhook URL = `slack_webhook_url`

## 2. Deploy to Google Cloud
  ### Pre-requisite: Setup Google Cloud
- create a Google Cloud project - [https://cloud.google.com/resource-manager/docs/creating-managing-projects](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
- install gcloud - [https://cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)
- initialize gcloud - [https://cloud.google.com/sdk/docs/initializing](https://cloud.google.com/sdk/docs/initializing)
- gcloud config set project `PROJECT_ID`
### Build and deploy to Google Cloud
- npm install
[Deploy a Node.js service to Cloud Run](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-nodejs-service)
- gcloud run deploy
- Note the Service URL = `serviceURL`

## 3. Integrate with Sauce Labs Webhook
![slack-incoming-webhook](./images/slack-incoming-webhook.jpg)
- Login to Sauce Labs [https://accounts.saucelabs.com/](https://accounts.saucelabs.com/)
- Go to [https://app.saucelabs.com/integrations](https://app.saucelabs.com/integrations)
- Enable Webhooks
- Set the WEBHOOK URL to `serviceURL`?slack_webhook=`slack_webhook_url`
- Select 'All Tests' for both Virtual Devices and Real Devices
- Save
- Run some tests and watch the Slack channel for notifications

## Testing Locally (Optional)
### Pre-requisites
#### Create a Slack App
A Slack app is required to use the Slack API to search messages in a channel
- [https://api.slack.com/methods/search.messages](https://api.slack.com/methods/search.messages)
- [https://api.slack.com/apps](https://api.slack.com/apps)
- Click 'Create New App'
- From Scratch
- App Name = Sauce Slack Webhook
- Select workspace
- Click 'Permissions'
- Under 'User Token Scopes', click 'Add an OAuth Scope'
- Select 'search:read'
- Scroll up and click 'Install to Workspace'
- Click 'Allow'
- In Slack, invite this Slack App into the channel associated with the Slack Webhook
#### Set Environment Variables
- `SLACK_WEBHOOK_URL` - from Step 1 above
- `SLACK_APP_TOKEN` - retrieve from the 'Install App' under 'Settings'
### Run service locally and send a test message to Slack
#### Run service in a local server
- npm start
#### Send the test message
In separate terminal,
- npm test
