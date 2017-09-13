import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import Header from '../../components/generic/Header';

const mapStateToProps = state => {}

const mapDispatchToProps = dispatch => ({
    navigateTo: url => {
        dispatch(push(url));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Header);
