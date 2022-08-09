var assert = require('assert');
const axios = require('axios');
var crypto = require("crypto");

let id = crypto.randomBytes(20).toString('hex')
let service_url = 'http://localhost:8080'
const slack_webhook_url = process.env.SLACK_WEBHOOK_URL
const slack_app_token = process.env.SLACK_APP_TOKEN
const slack_url = 'https://slack.com/api/search.messages'
const headers = {
  headers: {
    'Authorization': `Bearer ${slack_app_token}`
  }
}
const obj = {
  "id": id,
  "creation_time": "2022-06-19T17:58:35+00:00",
  "modification_time": "2022-06-19T17:59:01+00:00",
  "owner_id": "3c02dd3626374c5599c208a8958a26e7",
  "org_id": "7fb25570b4064716b9b6daae1a846790",
  "team_id": "212c8b8349cb436e86c92ac10f67aa73",
  "status": "PASSED",
  "name": "Chrome using global mode setting - examples/actions.spec.js",
  "tags": [
    "e2e",
    "release team",
    "other tag"
  ],
  "automation_backend": "cypress",
  "data_type": "vdc",
  "owner": "clarako",
  "passed": 1,
  "os_name": "Windows",
  "os_version": "10",
  "duration_sec": "25",
  "device": "",
  "app": "storage:4cfe9b2b-c7f1-4c18-afcd-47166c7de9f9",
  "error": "",
  "exception": "",
  "build": "Github Run",
  "browser_name": "Chrome",
  "browser_version": "102.0",
  "group_id": "8cdb4afe7cba4846b5cae339a87e3b70",
  "visibility": "TEAM",
  "commit_id": "",
  "branch_name": "",
  "team_name": "Default team (Default line of business)",
  "sl_url": `https://app.saucelabs.com/tests/${id}`,
  "start_time": null
}
const expected_color = '36a64f'
const expected_text = '2022-06-19 10:59:01 (25 sec)\n' +
  '*Framework:* cypress | *OS:* Windows 10 | *Browser:* Chrome 102.0'
const expected_title = `<https://app.saucelabs.com/tests/${id}|Chrome using global mode setting - examples/actions.spec.js> - PASSED`
const expected_footer = '@clarako | *Build:* Github Run | *Tags:* e2e, release team, other tag'

describe('Test message to Slack', () => {
  it('should be found in channel in correct format', async () => {
    await axios.post(`${service_url}?slack_webhook=${slack_webhook_url}`, obj)

    // query
    await sleep(30000)
    // console.log('query')
    let res = await axios.get(`${slack_url}?query=${id}`,headers)
    // console.log(res.data)
    // console.log('total',res.data.messages.total)
    assert.notEqual(res.data.messages.total,0,"Notification not found")
    let found = res.data.messages.matches[0].attachments[0]
    // console.log('color',found.color)
    assert.equal(found.color, expected_color,"Color not matching")
    // console.log('text',found.text)
    assert.equal(found.text, expected_text,"Text not matching")
    // console.log('title',found.title)
    assert.equal(found.title, expected_title,"Title not matching")
    // console.log('footer',found.footer)
    assert.equal(found.footer, expected_footer,"Footer not matching")
    // console.log('end')
  });
});

function sleep(ms) {
  // console.log('sleep',ms)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms)
  })
}
