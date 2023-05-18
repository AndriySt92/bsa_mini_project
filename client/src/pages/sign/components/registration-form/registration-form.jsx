import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { useAppForm, useState } from 'libs/hooks/hooks.js';
import {
  ButtonType,
  ButtonSize,
  ButtonColor,
  AppRoute,
  IconName,
  UserPayloadKey
} from 'libs/enums/enums.js';
import { Button } from 'libs/components/button/button.jsx';
import { Input } from 'libs/components/input/input.jsx';
import { Message } from 'libs/components/message/message.jsx';
import { Segment } from 'libs/components/segment/segment.jsx';
import { registration as registrationValidationSchema } from 'packages/validation-schemas/validation-schemas.js';
import { DEFAULT_REGISTRATION_PAYLOAD } from './libs/common/constants.js';
import styles from './styles.module.scss';

const RegistrationForm = ({ onRegister }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { control, errors, handleSubmit } = useAppForm({
    defaultValues: DEFAULT_REGISTRATION_PAYLOAD,
    validationSchema: registrationValidationSchema
  });

  const handleRegister = values => {
    setIsLoading(true);

    onRegister(values)
      .unwrap()
      .catch(() => {
        // TODO: show error
        setIsLoading(false);
      });
  };

  return (
    <>
      <h2 className={styles.title}>Register for free account</h2>
      <form name="registrationForm" onSubmit={handleSubmit(handleRegister)}>
        <Segment>
          <fieldset disabled={isLoading} className={styles.fieldset}>
            <Input
              name={UserPayloadKey.USERNAME}
              type="text"
              placeholder="Username"
              iconName={IconName.USER}
              control={control}
              errors={errors}
            />
            <Input
              name={UserPayloadKey.EMAIL}
              type="email"
              placeholder="Email"
              iconName={IconName.AT}
              control={control}
              errors={errors}
            />
            <Input
              name={UserPayloadKey.PASSWORD}
              type="password"
              placeholder="Password"
              iconName={IconName.LOCK}
              control={control}
              errors={errors}
            />
            <Button
              type={ButtonType.SUBMIT}
              color={ButtonColor.TEAL}
              size={ButtonSize.LARGE}
              isLoading={isLoading}
              isFluid
              isPrimary
            >
              Register
            </Button>
          </fieldset>
        </Segment>
      </form>
      <Message>
        <span>Already with us?</span>
        <NavLink to={AppRoute.LOGIN}>Sign In</NavLink>
      </Message>
    </>
  );
};

RegistrationForm.propTypes = {
  onRegister: PropTypes.func.isRequired
};

export { RegistrationForm };
