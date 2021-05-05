import * as React from 'react';
import { Form, Button, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import validator from 'validator';

const RegistrationForm = ({ onRegister }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [isEmailValid, setEmailValid] = React.useState(true);
  const [isUsernameValid, setUsernameValid] = React.useState(true);
  const [isPasswordValid, setPasswordValid] = React.useState(true);

  const emailChanged = value => {
    setEmail(value);
    setEmailValid(true);
  };

  const usernameChanged = value => {
    setUsername(value);
    setUsernameValid(true);
  };

  const passwordChanged = value => {
    setPassword(value);
    setPasswordValid(true);
  };

  const register = async () => {
    const isValid = isEmailValid && isUsernameValid && isPasswordValid;
    if (!isValid || isLoading) {
      return;
    }
    setLoading(true);
    try {
      await onRegister({ email, password, username });
    } catch {
      setLoading(false);
    }
  };

  return (
    <Form name="registrationForm" size="large" onSubmit={register}>
      <Segment>
        <Form.Input
          fluid
          icon="at"
          iconPosition="left"
          placeholder="Email"
          type="email"
          error={!isEmailValid}
          onChange={ev => emailChanged(ev.target.value)}
          onBlur={() => setEmailValid(validator.isEmail(email))}
        />
        <Form.Input
          fluid
          icon="user"
          iconPosition="left"
          placeholder="Username"
          type="text"
          error={!isUsernameValid}
          onChange={ev => usernameChanged(ev.target.value)}
          onBlur={() => setUsernameValid(Boolean(username))}
        />
        <Form.Input
          fluid
          icon="lock"
          iconPosition="left"
          placeholder="Password"
          type="password"
          onChange={ev => passwordChanged(ev.target.value)}
          error={!isPasswordValid}
          onBlur={() => setPasswordValid(Boolean(password))}
        />
        <Button type="submit" color="teal" fluid size="large" loading={isLoading} primary>
          Register
        </Button>
      </Segment>
    </Form>
  );
};

RegistrationForm.propTypes = {
  onRegister: PropTypes.func.isRequired
};

export default RegistrationForm;
