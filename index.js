const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const moment = require('moment');
const GREEN = "#36a64f"
const RED = "#ff0000"

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.post('/', async (req, res) => {
  let url = req.query.slack_webhook;
  console.log('POST received', url, req.headers, req.body);
  if(url===undefined) res.sendStatus(400);
  if(!checkBody(req.body)) res.sendStatus(400);

  let name = req.body.name;
  let sl_url = req.body.sl_url;
  let status = req.body.status;
  let color = GREEN
  if(status!=="PASSED"&&status!=="COMPLETE") color = RED

  // Line 1
  let datetime = moment(req.body.modification_time).format('YYYY-MM-DD HH:mm:ss');
  let duration_sec = req.body.duration_sec;
  let line1 = `${datetime} (${duration_sec} sec)`

  // Line 2
  let framework = get_label_value(req.body,'automation_backend','*Framework:* ','')
  let os = `${get_label_value(req.body,'os_name','*OS:* ',' | ')} ${get_label_value(req.body,'os_version','','')}`
  let browser = `${get_label_value(req.body,'browser_name','*Browser:* ',' | ')} ${get_label_value(req.body,'browser_version','','')}`
  let device = get_label_value(req.body,'device','*Device:* ',' | ')
  let line2 = `${framework}${os}${browser}${device}`

  // Error
  let error = get_label_value(req.body,'error','*Error:* ','\n')
  let exception = get_label_value(req.body,'exception','*Exception:* ','\n')

  // Footer
  let owner = get_label_value(req.body,'owner','@','')
  let team = get_label_value(req.body,'team_name','*Team:* ','')
  if(team.includes('Default')) team = ''
  let build = get_label_value(req.body,'build','*Build:* ','')
  let tags = get_label_value(req.body,'tags','*Tags:* ','',true)
  let arr = [owner,team,build,tags]
  let footer = ''
  for(let i=0;i<arr.length;i++) {
    let item = arr[i]
    if(item.length>0) {
      footer += item + ' | '
    }
  }
  let lastIndex = footer.lastIndexOf(' | ')
  footer = footer.substring(0,lastIndex)

  // Obj
  let obj = {
      "attachments": [
          {
              "color": color,
              "title": `<${sl_url}|${name}> - ${status}`,
              "text": `${line1}\n${line2}${error}${exception}`,
              "footer": footer
          }
      ]
  }
  console.log('Sending to Slack',obj)
  await axios.post(url, obj);
  res.sendStatus(200);
});

function checkBody(body) {
  let required_fields = ['id','owner_id','org_id','team_id','name','status','sl_url','modification_time','duration_sec']
  for(let i=0;i<required_fields.length;i++) {
    let field = required_fields[i]
    if(field===undefined) return false
  }
  return true
}

function get_label_value(body,attr,label,prefix='',is_array=false) {
  let res = ''
  let value = get_value(body,attr)
  if(value.length===0) return ''
  // check for array
  if(is_array) value = value.toString().replace(/,/g,', ')
  // return
  return `${prefix}${label}${value}`
}

function get_value(body,attr) {
  if(body[attr]===undefined||body[attr]===null) return ''
  else return body[attr]
}

app.listen(8080, () => console.log(`Started server!`));
