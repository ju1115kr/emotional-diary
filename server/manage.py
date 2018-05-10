#!/usr/bin/env python
import os
from app import create_app, socketio
from flask_script import Manager, Shell, Command

app = create_app('default')
manager = Manager(app)

host = 'localhost'
port = 9009


def make_shell_context():
    return dict(app=app)


manager.add_command("shell", Shell(make_context=make_shell_context))


@manager.command
def rs():
    socketio.run(app, host="0.0.0.0", port=port, debug=True)


if __name__ == '__main__':
    manager.run()
