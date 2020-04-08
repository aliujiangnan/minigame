/****************************************************************************
 Copyright (c) 2015-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
package org.cocos2dx.javascript;

import org.cocos2d.miniarcher.R;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

import android.os.Bundle;

import android.content.Intent;
import android.content.res.Configuration;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;

import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.reward.RewardedVideoAdListener;
import com.google.android.gms.ads.rewarded.RewardItem;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdCallback;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;
import com.google.android.gms.ads.reward.RewardedVideoAd;
import com.google.android.gms.ads.InterstitialAd;

import androidx.annotation.NonNull;

public class AppActivity extends Cocos2dxActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            // Android launched another instance of the root activity into an existing task
            //  so just quietly finish and go away, dropping the user back into the activity
            //  at the top of the stack (ie: the last state of this task)
            // Don't need to finish it again since it's finished in super.onCreate .
            return;
        }
        // DO OTHER INITIALIZATION BELOW
        SDKWrapper.getInstance().init(this);
        initSdk();
    }

    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);
        SDKWrapper.getInstance().setGLSurfaceView(glSurfaceView, this);

        return glSurfaceView;
    }

    @Override
    protected void onResume() {
        mRewardedVideoAd.resume(this);
        super.onResume();
        SDKWrapper.getInstance().onResume();

    }

    @Override
    protected void onPause() {
        mRewardedVideoAd.pause(this);
        super.onPause();
        SDKWrapper.getInstance().onPause();

    }

    @Override
    protected void onDestroy() {
        mRewardedVideoAd.destroy(this);
        super.onDestroy();
        SDKWrapper.getInstance().onDestroy();

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.getInstance().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.getInstance().onNewIntent(intent);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.getInstance().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.getInstance().onStop();
    }

    @Override
    public void onBackPressed() {
        SDKWrapper.getInstance().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.getInstance().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.getInstance().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.getInstance().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.getInstance().onStart();
        super.onStart();
    }

    private static String TAG = null;
    private static AppActivity mActivity = null;
    private RewardedAd mRewardedAd;
    private RewardedVideoAd mRewardedVideoAd;
    private InterstitialAd mInterstitialAd;
    private AdView mAdView;
    private boolean bRewardAdCompelete = false;

    public void initSdk(){
        TAG = this.getLocalClassName();

        mActivity = this;

        MobileAds.initialize(this,
                "ca-app-pub-8313686739617927~2164006098");

        // Use an activity context to get the rewarded video instance.
        mRewardedVideoAd = MobileAds.getRewardedVideoAdInstance(this);
        mRewardedVideoAd.setRewardedVideoAdListener(new RewardedVideoAdListener() {

            @Override
            public void onRewardedVideoAdLoaded() {
                Log.d(TAG, "RewardedVideoAdLoaded");
            }

            @Override
            public void onRewardedVideoAdOpened() {

            }

            @Override
            public void onRewardedVideoStarted() {

            }

            @Override
            public void onRewardedVideoAdClosed() {
                if(bRewardAdCompelete){
                    runOnGLThread(new Runnable() {
                        @Override
                        public void run() {
                            Cocos2dxJavascriptJavaBridge.evalString("gameInstance.sdkHelper.onAdCallback(\"played\")");
                        }
                    });
                }
                bRewardAdCompelete = false;
                loadRewardedVideoAd();
            }

            @Override
            public void onRewarded(com.google.android.gms.ads.reward.RewardItem rewardItem) {

            }

            @Override
            public void onRewardedVideoAdLeftApplication() {

            }

            @Override
            public void onRewardedVideoAdFailedToLoad(int i) {
                Log.d(TAG, "RewardedVideoAdFailedToLoad");
            }

            @Override
            public void onRewardedVideoCompleted() {
                Log.d(TAG, "RewardedVideoCompleted");
                bRewardAdCompelete = true;

            }
        });
        loadRewardedVideoAd();

        mInterstitialAd = new InterstitialAd(this);
        mInterstitialAd.setAdUnitId("ca-app-pub-3940256099942544/1033173712");
        mInterstitialAd.setAdListener(new AdListener() {
            @Override
            public void onAdLoaded() {
                // Code to be executed when an ad finishes loading.
                Log.d(TAG, "InterstitialAdLoaded");
            }

            @Override
            public void onAdFailedToLoad(int errorCode) {
                // Code to be executed when an ad request fails.
                Log.d(TAG, "InterstitialAdFailedToLoad");
            }

            @Override
            public void onAdOpened() {
                // Code to be executed when the ad is displayed.
            }

            @Override
            public void onAdClicked() {
                // Code to be executed when the user clicks on an ad.
            }

            @Override
            public void onAdLeftApplication() {
                // Code to be executed when the user has left the app.
            }

            @Override
            public void onAdClosed() {
                // Code to be executed when the interstitial ad is closed.
                mInterstitialAd.loadAd(new AdRequest.Builder().build());
            }
        });
        mInterstitialAd.loadAd(new AdRequest.Builder().build());

        LayoutInflater inflater = LayoutInflater.from(this);
        View view = inflater.inflate(R.layout.main_activity, null);
        RelativeLayout layout = view.findViewById(R.id.main_activity);
        mAdView = layout.findViewById(R.id.adView);

        DisplayMetrics dm;
        dm = new DisplayMetrics();
        this.getWindowManager().getDefaultDisplay().getMetrics(dm);
        final int width = dm.widthPixels;
        final int height = dm.heightPixels;
        LinearLayout.LayoutParams param =  new LinearLayout.LayoutParams(width, height);

        addContentView(layout,param);
        mAdView.setVisibility(View.INVISIBLE);

        AdRequest adRequest = new AdRequest.Builder().build();
        mAdView.setAdListener(new AdListener() {
            @Override
            public void onAdLoaded() {
                // Code to be executed when an ad finishes loading.
                Log.d(TAG, "AdLoaded");
            }

            @Override
            public void onAdFailedToLoad(int errorCode) {
                // Code to be executed when an ad request fails.
                Log.d(TAG, "AdFailedToLoad");
            }

            @Override
            public void onAdOpened() {
                // Code to be executed when an ad opens an overlay that
                // covers the screen.
            }

            @Override
            public void onAdClicked() {
                // Code to be executed when the user clicks on an ad.
            }

            @Override
            public void onAdLeftApplication() {
                // Code to be executed when the user has left the app.
            }

            @Override
            public void onAdClosed() {
                // Code to be executed when the user is about to return
                // to the app after tapping on an ad.
            }
        });
        mAdView.loadAd(adRequest);
    }

    public static  AppActivity getActivity(){
        return mActivity;
    }

    public static void showAd(int type){
        Log.d(TAG, "showAd: type: " + type);
        AppActivity.getActivity().showAdmob(type);
    }

    public void showAdmob(int type){
        switch (type){
            case 0:{
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        mAdView.setVisibility(mAdView.getVisibility() == View.INVISIBLE ? View.VISIBLE : View.INVISIBLE);
                    }
                } );
            }
            break;
            case 1:{
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if (mInterstitialAd.isLoaded()) {
                            mInterstitialAd.show();
                        } else {
                            Log.d("TAG", "The interstitial wasn't loaded yet.");
                            mInterstitialAd.loadAd(new AdRequest.Builder().build());
                        }
                    }
                } );
            }
            break;
            case 2:{
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if (mRewardedVideoAd.isLoaded()) {
                            mRewardedVideoAd.show();
                        } else {
                            Log.d("TAG", "The rewarded ad wasn't loaded yet.");
                            AppActivity.getActivity().loadRewardedVideoAd();
                        }
                    }
                } );
            }
            break;
        }
    }

    private void loadRewardAd(){
        RewardedAdLoadCallback adLoadCallback = new RewardedAdLoadCallback() {
            @Override
            public void onRewardedAdLoaded() {
                // Ad successfully loaded.
                Log.d(TAG, "RewardedAdLoaded");
            }

            @Override
            public void onRewardedAdFailedToLoad(int errorCode) {
                // Ad failed to load.
                Log.d(TAG, "RewardedAdFailedToLoad");
            }
        };
        mRewardedAd.loadAd(new AdRequest.Builder().build(), adLoadCallback);
    }

    private void loadRewardedVideoAd() {
        mRewardedVideoAd.loadAd("ca-app-pub-3940256099942544/5224354917",
                new AdRequest.Builder().build());
    }
}
