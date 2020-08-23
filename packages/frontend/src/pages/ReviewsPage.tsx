import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SettingsIcon from '@material-ui/icons/Settings';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { reviewService, authService, userService } from '../services';

const ReviewsPage = ({ history }: any) => {
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
      },
      title: {
        margin: theme.spacing(4, 0, 2),
      },
      list: {
        backgroundColor: theme.palette.background.paper,
      },
      block: {
        display: 'block',
      },
      inline: {
        display: 'inline',
      },
      typography: {
        padding: theme.spacing(2),
      },
    })
  );
  const [currentUser] = useState(authService.getCurrentUser());
  const [isAdmin] = useState(currentUser.role?.name === 'admin');
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedReviewer, setSelectedReviewer] = React.useState<string | null>(
    null
  );
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const classes = useStyles();

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await userService.getAll();
      setUsers(users.filter((user: any) => user.id !== currentUser.id));
    };
    const fetchReviews = async () => {
      const reviews = await (currentUser.role?.name === 'admin'
        ? reviewService.getAll()
        : reviewService.getAssigned(currentUser.id));
      setReviews(reviews);
    };

    fetchUsers();
    fetchReviews();
  }, []);

  const onSelectedReviewerChanged = (reviewId: string, newValue: any) => {
    setSelectedReviewer(newValue);
    const reviewerId = newValue?.id;
    if (reviewerId) {
      reviewService.assignReviewer(reviewId, reviewerId);
    }
  };

  const onShowPopup = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const onClosePopup = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Container maxWidth="sm">
        <Typography variant="h6" className={classes.title}>
          Reviews
        </Typography>
        <div className={classes.list}>
          {reviews && (
            <List className={classes.root}>
              {reviews.map((review: any, idx: number) => (
                <>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar alt={review.reviewee.name} src="." />
                    </ListItemAvatar>
                    <ListItemText
                      primary={review.title}
                      secondary={
                        <>
                          {review.content}
                          <div className="mt-2" />
                          <span>Assigned Reviewers: </span>
                          {review.reviewers?.map(
                            (reviewer: any, idx: number) => (
                              <Typography
                                component="span"
                                variant="body2"
                                className={classes.inline}
                                color="textPrimary"
                              >
                                {reviewer.name}
                              </Typography>
                            )
                          )}
                          <div className="mt-2" />

                          <List className={classes.root}>
                            {review.comments?.map(
                              (comment: any, idx: number) => (
                                <ListItem
                                  style={{ justifyContent: 'flex-start' }}
                                >
                                  <ListItemAvatar
                                    style={{ alignSelf: 'flex-start' }}
                                  >
                                    <Avatar alt={comment.author} src="." />
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={review.title}
                                    secondary={
                                      <Typography
                                        component="span"
                                        variant="body2"
                                        className={classes.inline}
                                        color="textPrimary"
                                      >
                                        {comment.body}
                                      </Typography>
                                    }
                                  ></ListItemText>
                                </ListItem>
                              )
                            )}
                          </List>
                          <hr />
                          <Formik
                            initialValues={{
                              comment: '',
                            }}
                            validationSchema={Yup.object().shape({
                              comment: Yup.string().required(
                                'comment is required'
                              ),
                            })}
                            onSubmit={(
                              { comment },
                              { setStatus, setSubmitting }
                            ) => {
                              setStatus();
                              reviewService
                                .addComment(
                                  review.id,
                                  String(currentUser.id),
                                  comment
                                )
                                .then(
                                  (comment) => {
                                    history.go(0);
                                  },
                                  (error) => {
                                    setSubmitting(false);
                                    setStatus(error);
                                  }
                                );
                            }}
                            render={({
                              errors,
                              status,
                              touched,
                              isSubmitting,
                            }) => (
                              <Form>
                                <div className="form-group">
                                  <label htmlFor="comment">comment</label>
                                  <Field
                                    name="comment"
                                    component="textarea"
                                    placeholder="Write some feedback..."
                                    rows={5}
                                    className={
                                      'form-control' +
                                      (errors.comment && touched.comment
                                        ? ' is-invalid'
                                        : '')
                                    }
                                  />
                                  <ErrorMessage
                                    name="comment"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>
                                <div className="form-group">
                                  <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSubmitting}
                                  >
                                    Add
                                  </button>
                                  {isSubmitting && (
                                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                  )}
                                </div>
                                {status && (
                                  <div className={'alert alert-danger'}>
                                    {status}
                                  </div>
                                )}
                              </Form>
                            )}
                          />
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <>
                        {isAdmin && (
                          <Tooltip title="Add Reviewer">
                            <IconButton edge="end" aria-label="delete">
                              <SettingsIcon onClick={onShowPopup} />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Popover
                          id={id}
                          open={open}
                          anchorEl={anchorEl}
                          onClose={onClosePopup}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                          }}
                        >
                          <Autocomplete
                            id={`reviewer-selector-${idx}`}
                            style={{ width: 250, margin: 5 }}
                            options={users.filter(
                              (user: any) => review.reviewee.id !== user.id
                            )}
                            value={selectedReviewer}
                            onChange={(event: any, newValue: any | null) =>
                              onSelectedReviewerChanged(review.id, newValue)
                            }
                            autoHighlight
                            getOptionLabel={(option: any) => option.name}
                            renderOption={(option: any) => (
                              <>
                                <span className={'mr-3'}>
                                  <Avatar alt={option.name} src="." />
                                </span>
                                {option.name}
                              </>
                            )}
                            renderInput={(params: any) => (
                              <TextField
                                {...params}
                                label="Type or choose name..."
                                variant="outlined"
                                inputProps={{
                                  ...params.inputProps,
                                  autoComplete: 'new-password', // disable autocomplete and autofill
                                }}
                              />
                            )}
                          />
                        </Popover>
                      </>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <hr />
                </>
              ))}
            </List>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ReviewsPage;
