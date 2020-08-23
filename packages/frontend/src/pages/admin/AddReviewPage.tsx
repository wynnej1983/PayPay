import React, { useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import * as qs from 'qs';

import { reviewService } from '../../services';

const AddReviewPage = ({ history, location }: any) => {
  const { revieweeId, revieweeName } = qs.parse(location.search.substring(1));
  return (
    <div>
      <div className="alert alert-info">
        <strong>Review for {revieweeName}</strong>
      </div>
      <h2>Add Review</h2>
      <Formik
        initialValues={{
          title: '',
          content: '',
        }}
        validationSchema={Yup.object().shape({
          title: Yup.string().required('title is required'),
          content: Yup.string().required('content is required'),
        })}
        onSubmit={({ title, content }, { setStatus, setSubmitting }) => {
          setStatus();
          reviewService.create(title, content, String(revieweeId)).then(
            (review) => {
              const { from } = location.state || {
                from: { pathname: '/admin/reviews' },
              };
              history.push(from);
            },
            (error) => {
              setSubmitting(false);
              setStatus(error);
            }
          );
        }}
        render={({ errors, status, touched, isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="title">title</label>
              <Field
                name="title"
                type="text"
                className={
                  'form-control' +
                  (errors.title && touched.title ? ' is-invalid' : '')
                }
              />
              <ErrorMessage
                name="title"
                component="div"
                className="invalid-feedback"
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">content</label>
              <Field
                name="content"
                type="text"
                component="textarea"
                rows={5}
                className={
                  'form-control' +
                  (errors.content && touched.content ? ' is-invalid' : '')
                }
              />
              <ErrorMessage
                name="content"
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
            {status && <div className={'alert alert-danger'}>{status}</div>}
          </Form>
        )}
      />
    </div>
  );
};

export default AddReviewPage;
