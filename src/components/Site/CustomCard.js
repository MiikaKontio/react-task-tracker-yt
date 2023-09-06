import { Card } from "react-bootstrap";
import * as Constants from '../../utils/Constants';
import RightWrapper from "./RightWrapper";
import Icon from "../Icon";
import StarRating from "../StarRating/StarRating";
import { Link } from "react-router-dom";

export default function CustomCard({ id, iconName, title,
    showStarRating, stars, deleteConfirmText, subTitle, description, onDelete,
    linkText, linkUrl, children, editClicked
}) {

    return (

        <Card className='cardCustom' style={{ marginBottom: '10px' }}>
            <Card.Header>

                <RightWrapper>

                    <Icon name={Constants.ICON_EDIT} className={Constants.CLASSNAME_EDITBTN}
                        style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                        onClick={() => editClicked(id)}
                    />

                    <Icon name={Constants.ICON_DELETE} className={Constants.CLASSNAME_DELETEBTN}
                        style={{ color: Constants.COLOR_DELETEBUTTON, cursor: 'pointer', fontSize: '1.2em' }}
                        onClick={() => {
                            if (window.confirm(deleteConfirmText)) {
                                onDelete(id);
                            }
                        }}
                    />

                </RightWrapper>

                {iconName !== '' &&
                    <span>
                        <Icon name={iconName} color='gray' />
                    </span>
                }

                {
                    title !== '' && title
                }

                {showStarRating &&
                    <div style={{ fontWeight: 'normal' }}>
                        <StarRating starCount={stars} />
                    </div>
                }

            </Card.Header>

            <Card.Body>
                {
                    subTitle !== '' &&
                    <Card.Subtitle>{subTitle}</Card.Subtitle>
                }
                {
                    description !== '' &&
                    <Card.Text>
                        {description}
                    </Card.Text>
                }
                {
                    linkUrl !== '' &&
                    <Link className='btn btn-primary' to={linkUrl}>{linkText}</Link>
                }
                {children}
            </Card.Body>
        </Card>
    )
}