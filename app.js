const http = require('http');
const { validateEvent , validateAccount} = require('./validate');
const jwt = require('jsonwebtoken');

let accounts = [];
let events = [];
let id;
let eventIndex;
const SECRET_KEY = 'your-secret-key';
const processRequest = (req, res) => {
  const { url, method, headers } = req;
  if (url !== '/login' && url !== '/create-account' && (!headers || !headers.authorization)) {
    res.statusCode = 401;
    res.end('Acceso no autorizado');
    return;
  }
  let token;
  if (url !== '/login' && url !== '/create-account') {
    token = headers.authorization.split(' ')[1];
    try {
      jwt.verify(token, SECRET_KEY);
    } catch (e) {
      res.statusCode = 401;
      res.end('Acceso no autorizado');
      return;
    }
  }

  switch(method){
    case 'POST':
      switch(url){
        case '/create-account': {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            const accountData = JSON.parse(body);
            const { error } = validateAccount(accountData);
            if (error) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({ status: res.statusCode, message: error.details[0].message }, null, 2));
              return;
            }
            const account = {
              id: accounts.length + 1,
              email: accountData.email,
              name: accountData.name,
              password: accountData.password
            };
            accounts.push(account);
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify(account));
          });
          break;
        }
        case '/login': {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              const { email, password } = JSON.parse(body);
              const account = accounts.find(a => a.email === email && a.password === password);
              if (!account) {
                res.statusCode = 401;
                res.end('Acceso no autorizado');
                return;
              }
              const token = jwt.sign({ id: account.id }, SECRET_KEY);
              res.statusCode = 200;
              res.end(JSON.stringify({
                status: res.statusCode,
                data: {
                  token: `${token}`,
                  email: account.email,
                  id: account.id
                }
              }, null, 2));
            });
            break;
          }
        case '/create-event': {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            const eventData = JSON.parse(body);
            const { error } = validateEvent(eventData);
            if (error) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({ status: res.statusCode, message: error.details[0].message }, null, 2));
              return;
            }
            const event = {
              id: events.length + 1,
              name: eventData.name,
              date: eventData.date,
              city: eventData.city,
              participants: eventData.participants
            };
            events.push(event);
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify(event));
          });
          break;
        }
        default:
          res.statusCode = 404;
          res.end('Not Found');
      }   
      break;
    case 'PUT':
      id = url.split('/')[2];
      eventIndex = events.findIndex(e => e.id === Number(id));
      if (eventIndex === -1) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ status: res.statusCode, message: 'Evento no encontrado' }, null, 2));
        return;
      }
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const eventData = JSON.parse(body);
        const { error } = validateEvent(eventData);
        if (error) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ status: res.statusCode, message: error.details[0].message }, null, 2));
          return;
        }
        const updatedEvent = {
          ...events[eventIndex],
          ...eventData
        };
        events[eventIndex] = updatedEvent;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(updatedEvent));
      });
      break;
    case 'DELETE':
      id = url.split('/')[2];
      eventIndex = events.findIndex(e => e.id === Number(id));
      if (eventIndex === -1) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ status: res.statusCode, message: 'Evento no encontrado' }, null, 2));
        return;
      }
      events.splice(eventIndex, 1);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ status: 200, message: 'Evento eliminado con éxito' }, null, 2));
      break;
    default:
      res.statusCode = 404;
      res.end('Not Found');
  }
}

const server = http.createServer(processRequest);
server.listen(3000, () => console.log('Server running on port 3000'));