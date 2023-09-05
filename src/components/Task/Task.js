import { Link } from 'react-router-dom';
import Icon from '../Icon';
import * as Constants from '../../utils/Constants';
import RightWrapper from '../Site/RightWrapper';
import AddTask from './AddTask';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import { useToggle } from '../useToggle';
import { Card } from 'react-bootstrap';

export default function Task({ taskListID, archived, task, onDelete, onToggle }) {

    //toggle
    const { status: editable, toggleStatus: toggleSetEditable } = useToggle();

    const updateTask = (updateTaskListID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseByIdAndSubId(Constants.DB_TASKS, updateTaskListID, task.id, object);
        toggleSetEditable();
    }

    return (
        <>
            <Card style={{ marginBottom: '10px' }}
                onDoubleClick={() => archived ? null : onToggle(taskListID, task.id)}
                className={`cardCustom ${archived ? '' : 'clickable'} ${task.reminder ? 'reminder' : ''}`}
            >
                <Card.Header>
                    <h5>
                        { /* TODO: Rakenna view details arkiston taskin katselulle? */
                            archived ? <span>{task.text}</span> :
                                <span>
                                    <Link to={`${Constants.NAVIGATION_TASK}/${task.id}/${taskListID}`}>{task.text}</Link>
                                </span>
                        }
                        {archived ? null :
                            <RightWrapper>
                                <Icon name={Constants.ICON_EDIT} className={Constants.CLASSNAME_EDITBTN}
                                    style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                                    onClick={() => toggleSetEditable()} />
                                <Icon name={Constants.ICON_DELETE} className={Constants.CLASSNAME_DELETEBTN}
                                    style={{ color: Constants.COLOR_DELETEBUTTON, cursor: 'pointer', fontSize: '1.4em' }}
                                    onClick={() => onDelete(taskListID, task.id)} />
                            </RightWrapper>
                        }
                    </h5>
                </Card.Header>
                <Card.Body>
                    <Card.Subtitle>
                        {
                            !editable &&
                            <>
                                <p>{task.day}</p>
                            </>
                        }
                    </Card.Subtitle>
                    <Card.Text>
                        {
                            editable && <AddTask
                                taskID={task.id}
                                taskListID={taskListID}
                                onClose={() => toggleSetEditable()}
                                onSave={updateTask}
                                showLabels={false} />
                        }
                    </Card.Text>
                </Card.Body>
            </Card>
        </>
    )
}