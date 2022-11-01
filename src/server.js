const restify = require('restify');
const port = process.env.PORT || 3000;
const server = restify.createServer({
    name: 'Basic Server',
    version: '1.0.0'
});

const users = [
    { id: 1, name: 'Fahmi Ihza Sulistya Ananta'},
    { id: 2, name: 'Alifianti Mustika Tri Widodo'},
    { id: 3, name: 'Ariel Tatum'}
]

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

const ensureAuthenticated = (idCard) => {
    return (req, res, next) => {
        if (req.headers.authorization === idCard) {
            next();
        } else {
            res.send(401, { message: 'Anda tidak boleh masuk'});
        }
    }
}

//http://localhost:3000/movie/horror?filterBy=name&sortOrder=asc&max=7
server.get('/movie1/*', (req, res) => {
    const paramList = ['category', 'year', 'tittle'];
    console.log(req.params)
    const params = req.params['*'].split('/');
    const objParams = {};
    params.forEach((param, index) => {
        if (index < paramList.length) {
            objParams[paramList[index]] = param;
        }
    })
    res.send(200, { params: objParams, query: req.query });
});

//http://localhost:3000/movie2/horror?userId=1
server.get('/movie2/*', (req, res) => {
    const { userId } = req.query;
    const user = users.filter(user => user.id === +userId)[0];
    if(!user){
        return res.send(404, { message: `Ùser dengan id ${userId} tidak ditemukan`})
    }
    const message = 'Berhasil mendapatkan user terkait userId dengan req.params';
    res.send(200, { message, data: user });
});

server.get('/', (req, res) => {
    res.send(200, 'Selamat datang di apps aku')
});

server.get('/api/v1/users', ensureAuthenticated('1'), (req, res) => {
    res.send(200, users);
});

server.get('/api/v1/users/:id', ensureAuthenticated('2'), (req, res) => {
    console.log(req.params.id);
    const user = users.filter(user => user.id === +req.params.id)[0];
    if (!user) {
        return res.send(404, {message : `User dengan id ${req.params.id} tidak ditemukan`})
    }
    res.send(200, user);
});

server.post('/api/v1/users', (req, res) => {
    const user = {id: users.length + 1, name: req.body.name };
    console.log(user);
    users.push(user);
    res.send(201, {message: 'Berhasil membuat User baru'});
})

server.put('/api/v1/users/:id', (req, res) => {
    const userId = +req.params.id;
    const { name } = req.body;
    const indexOfUser = users.findIndex(user => user.id === userId);
    console.log('Index of user: ' + indexOfUser);
    users[indexOfUser].name = name;
    res.send(200, users[indexOfUser]);
})

server.del('/api/v1/users/:id', (req, res) => {
    const userId = +req.params.id;
    const indexOfUser = users.findIndex(user => user.id === userId);
    if(indexOfUser === -1){
        return res.send(404, {message : `User dengan id ${req.params.id} tidak ditemukan`})
    }
    users.splice(indexOfUser, 1);
    res.send(200, {message: 'Berhasil menghapus user'});
})

server.listen(port, () => {
    console.log('Server sederhana di port ' + port + ' dengan nama ' + server.name + ' dengan server http://localhost:' + port)
})