import UniButtonComp from '@/components/overwrite/uni.button';
import './button.scss';
import { useAppSelector } from '@/utils/redux/utils/hooks';
import { selectTimeLimit } from '@/utils/redux/slicers/attempt.slicer';

const SideBarButtons: React.FC<{}> = () => {
    const selector = useAppSelector();
    const timeLimit = selector(selectTimeLimit);
    return (
        <div className="sidebar-buttons">
            <UniButtonComp custombutton='confirm'>Submit</UniButtonComp>
            {!timeLimit &&
                <div className="d-flex flex-column">
                    <div className='button-gap' />
                    <UniButtonComp custombutton='exit'>Exit</UniButtonComp>
                </div>
            }
        </div>
    )
}

export default SideBarButtons;