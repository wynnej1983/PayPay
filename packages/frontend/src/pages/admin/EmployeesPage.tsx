import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import RateReviewIcon from '@material-ui/icons/RateReview';

import { userService, authService } from '../../services';
import { capitalizeFirstLetter } from '../../helpers';

const EmployeesPage = ({ history }: any) => {
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      list: {
        backgroundColor: theme.palette.background.paper,
      },
      title: {
        margin: theme.spacing(4, 0, 2),
      },
    })
  );
  const [currentUser] = useState(authService.getCurrentUser());
  const [users, setUsers] = useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  const classes = useStyles();

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await userService.getAll();
      setUsers(users.filter((user: any) => user.id !== currentUser.id));
    };

    fetchUsers();
  }, []);

  const onSelectEmployee = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
    /* history.push('/admin/edit-employee'); */
  };

  const onReviewEmployee = async ({ id, name }: any) => {
    history.push(
      `/admin/reviews/new?revieweeId=${id}&revieweeName=${capitalizeFirstLetter(
        name
      )}`
    );
  };

  const onDeleteEmployee = async (id: string) => {
    await userService.remove(id);
    history.go(0);
  };

  return (
    <div>
      <Link to="/admin/add-employee" className="nav-item nav-link ml-2">
        <button type="submit" className="btn btn-primary">
          Add Employee
        </button>
      </Link>
      <Container maxWidth="sm">
        <Typography variant="h6" className={classes.title}>
          Employees
        </Typography>
        <div className={classes.list}>
          {users && (
            <List dense={false}>
              {users.map((user: any, idx: number) => (
                <ListItem
                  button
                  selected={selectedIndex === idx}
                  onClick={(event) => onSelectEmployee(event, idx)}
                >
                  <ListItemAvatar>
                    <Avatar alt={user.name} src="." />
                  </ListItemAvatar>
                  <ListItemText primary={user.name} secondary={user.email} />
                  <ListItemSecondaryAction>
                    <>
                      <Tooltip title="Review">
                        <IconButton edge="end" aria-label="delete">
                          <RateReviewIcon
                            onClick={() => onReviewEmployee(user)}
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton edge="end" aria-label="delete">
                          <DeleteIcon
                            onClick={() => onDeleteEmployee(user.id)}
                          />
                        </IconButton>
                      </Tooltip>
                    </>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </div>
      </Container>
    </div>
  );
};

export default EmployeesPage;
