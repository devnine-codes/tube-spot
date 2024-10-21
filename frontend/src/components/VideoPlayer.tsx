import React, { useEffect, useRef } from 'react';

interface VideoPlayerProps {
    videoId: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId }) => {
    const playerRef = useRef<HTMLDivElement>(null);
    const playerInstanceRef = useRef<any>(null); // 플레이어 인스턴스 참조
    const savedTime = useRef<number>(0); // 저장된 재생 시간 참조

    useEffect(() => {
        const onYouTubeIframeAPIReady = () => {
            playerInstanceRef.current = new (window as any).YT.Player(playerRef.current, {
                height: '390',
                width: '640',
                videoId: videoId,
                events: {
                    onReady: onPlayerReady,
                    onStateChange: onPlayerStateChange,
                },
            });
        };

        // 비디오 재생 시간 저장 함수
        const saveCurrentTime = () => {
            if (playerInstanceRef.current && playerInstanceRef.current.getCurrentTime) {
                const currentTime = playerInstanceRef.current.getCurrentTime();
                localStorage.setItem(`video-${videoId}-time`, String(currentTime));
            }
        };

        // IFrame API 동적 로드
        if (!(window as any).YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.body.appendChild(tag);
            (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
        } else {
            onYouTubeIframeAPIReady(); // API 이미 로드된 경우
        }

        // 재생 시간 주기적으로 저장
        const intervalId = setInterval(saveCurrentTime, 5000);

        return () => {
            clearInterval(intervalId); // 정리
            (window as any).YT = null;
        };
    }, [videoId]);

    // YouTube API 이벤트 핸들러
    const onPlayerReady = (event: any) => {
        // 로컬 스토리지에서 저장된 재생 시간 가져오기
        const storedTime = localStorage.getItem(`video-${videoId}-time`);
        savedTime.current = storedTime ? parseFloat(storedTime) : 0;

        // 저장된 시간부터 재생
        if (savedTime.current > 0) {
            event.target.seekTo(savedTime.current);
        }
        event.target.playVideo();
    };

    const onPlayerStateChange = (event: any) => {
        if (event.data === (window as any).YT.PlayerState.PAUSED || event.data === (window as any).YT.PlayerState.ENDED) {
            // 비디오가 일시정지 또는 종료될 때 재생 시간 저장
            const currentTime = event.target.getCurrentTime();
            localStorage.setItem(`video-${videoId}-time`, String(currentTime));
        }
    };

    return <div ref={playerRef}></div>;
};

export default VideoPlayer;
