import immutable from 'immutable';

const initialState = immutable.fromJS({

});

function reducer(state = initialState, action) {
    switch (action.type) {
    case 'LoginSuccess': {
        const linkmans = [];
        for (const group of action.user.groups) {
            group.type = 'group';
            linkmans.push(group);
        }
        for (const friend of action.user.friends) {
            friend.type = 'friend';
            linkmans.push(friend);
        }
        linkmans.sort((a, b) => {
            const lastMessageTimeOfA = a.messages.length === 0 ? a.createTime : a.messages[a.messages.length - 1].createTime;
            const lastMessageTimeOfB = b.messages.length === 0 ? b.createTime : b.messages[b.messages.length - 1].createTime;
            return new Date(lastMessageTimeOfB).getTime() - new Date(lastMessageTimeOfA).getTime();
        });
        action.user.linkmans = linkmans;

        return immutable.fromJS({
            _id: action.user._id,
            createTime: action.user.createTime,
            updateTime: action.user.updateTime,
            username: action.user.username,
            avatar: action.user.avatar,
            gender: action.user.gender,
            birthday: action.user.birthday,
            introduce: action.user.introduce,
            linkmans: action.user.linkmans,
        });
    }
    case 'CreateGroup': {
        return state;
    }

    case 'AddGroupMessage': {
        return state.updateIn(
            ['linkmans'],
            linkmans => {
                const groupIndex = linkmans.findIndex(g => g.get('type') === 'group' && g.get('_id') === action.message.to._id);
                const group = linkmans.get(groupIndex).updateIn(['messages'], m => m.push(immutable.fromJS(action.message)));
                return linkmans.delete(groupIndex).unshift(group);
            }
        );
    }

    default:
        return state;
    }
}

export default reducer;